#!/usr/bin/env node
/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

let testProcess = null;

let cleanupRan = false;
let stoppingTestProcess = false;
let isShuttingDown = false;

// Cleanup function that runs the delete-test-properties.js script
async function runDeleteTestProperties() {
  // prevent multiple runs
  if (cleanupRan) {
    return;
  }
  cleanupRan = true;

  try {
    console.log('Cleaning up test properties (delete-test-properties.js)...');
    const scriptPath = path.resolve(
      process.cwd(),
      'scripts/delete-test-properties.js'
    );
    const { stdout } = await execAsync(`node ${scriptPath}`);
    if (stdout) {
      console.log(stdout.trim());
    }
    console.log('✅ Cleanup completed');
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  }
}

/**
 * Handle the spawned test processes
 * @returns {Promise<void>}
 */
const killTestProcess = async () => {
  // Already cleaning up
  if (stoppingTestProcess) {
    return;
  }
  stoppingTestProcess = true;

  if (!testProcess || testProcess.exitCode !== null) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    console.log(`🛑 Killing test process...`);

    const forceKillTimeout = setTimeout(() => {
      if (testProcess.exitCode === null) {
        console.log(`⚡ Forcing kill of the test process...`);
        testProcess.kill('SIGKILL');
      }
    }, 5000);

    // calling SIGTERM or SIGKILL invokes this handler
    testProcess.once('exit', () => {
      console.log(`✅ The test process exited.`);
      clearTimeout(forceKillTimeout);
      resolve();
    });

    testProcess.kill('SIGTERM');
  });
};

/**
 * Kill the server and the test processes. Run cleanup script.
 * @returns {Promise<void>}
 */
async function shutdown() {
  if (isShuttingDown) {
    return Promise.resolve();
  }
  isShuttingDown = true;

  await killTestProcess();
  await runDeleteTestProperties();
}

// Register main process handlers
process.on('SIGINT', async () => {
  if (isShuttingDown) {
    console.log('⚠️ Shutdown already in progress, please wait...');
    return;
  }

  console.log('\nReceived SIGINT - cleaning up...');
  await shutdown();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  if (isShuttingDown) {
    console.log('⚠️ Shutdown already in progress, please wait...');
    return;
  }

  console.log('\nReceived SIGTERM - cleaning up...');
  await shutdown();
  process.exit(0);
});
process.on('uncaughtException', async (err) => {
  console.error('Uncaught exception:', err);
  await shutdown();
  process.exit(1);
});
process.on('unhandledRejection', async (reason) => {
  console.error('Unhandled rejection:', reason);
  await shutdown();
  process.exit(1);
});
// Register main process handlers

/**
 * Spin up the test server. Spin up multiple processes to run the tests sequentially.
 * @returns {Promise<void>}
 */
async function runIntegrationTests() {
  try {
    // Step 1: Run version check
    console.log('🔍 Running version check...');
    try {
      const { stdout } = await execAsync('node scripts/check-version.js');
      if (stdout) {
        console.log(stdout.trim());
      }
    } catch (error) {
      console.error('Version check failed:', error.message);
      throw error;
    }

    // Step 2: Run Node.js integration tests sequentially with synchronized reporting
    console.log('🚀 Running Node.js integration tests sequentially...');

    const TEST_TYPES = { COMMON_JS: 'commonJS', ES_MODULE: 'esModule' };
    // Buffer output for synchronized reporting
    const testResults = { commonJSResult: null, esModuleResult: null };
    const bundles = {
      [TEST_TYPES.COMMON_JS]: 'tmp.tests/commonjs/index.cjs',
      [TEST_TYPES.ES_MODULE]: 'tmp.tests/esmodule/index.js'
    };

    const runTestsSynchronously = async function () {
      for (const testTypeKey of Object.keys(TEST_TYPES)) {
        const testType = TEST_TYPES[testTypeKey];
        await new Promise((resolve, reject) => {
          const resultsVariable = `${testType}Result`;
          // tmp.tests/.../index.c?js
          const bundlePath = bundles[testType];
          testProcess = spawn('jasmine', [bundlePath], {
            stdio: ['inherit', 'pipe', 'pipe']
          });
          console.log(`Starting ${testType} tests...`);
          let synchronizedReportingOutput = '';
          testProcess.stdout.on('data', (data) => {
            if (!stoppingTestProcess) {
              const received = data.toString();
              // Only show real-time output, not the summary
              const lines = received.split('\n');
              lines.forEach((line) => {
                line = line.trim();
                if (
                  line &&
                  !line.match(/^\d+ specs?, \d+ failures?/) &&
                  !line.match(/^Finished in \d+/) &&
                  !line.match(/^Pending:$/)
                ) {
                  // something like "[commonJS] build waiting after 3000ms"
                  console.log(`[${testType}] ${line}`);
                } else {
                  // for synchronized reporting later
                  synchronizedReportingOutput += `${line}\n`;
                }
              });
            }
          });
          testProcess.stderr.on('data', (data) => {
            if (!stoppingTestProcess) {
              console.error(`[${testType}] ${data.toString().trim()}`);
            }
          });
          testProcess.on('error', (error) => {
            if (stoppingTestProcess) {
              return;
            }
            console.error(
              `❌ Failed to start ${testType} jasmine:`,
              error.message
            );
            killTestProcess();
            reject(error);
          });
          testProcess.on('close', (code) => {
            if (stoppingTestProcess) {
              return;
            }
            testResults[resultsVariable] = {
              code,
              output: synchronizedReportingOutput
            };
            if (code === 0) {
              console.log(
                `✅ ${testType} integration tests completed successfully`
              );
              resolve();
            } else {
              console.error(
                `❌ ${testType} integration tests failed with exit code ${code}`
              );
              killTestProcess();
              reject(
                new Error(`${testType} tests failed with exit code ${code}`)
              );
            }
          });
        });
      }
    };

    const displaySynchronizedResults = () => {
      // Extract and display summary information for both
      function extractSummary(output, label) {
        if (!output?.length) {
          return;
        }
        const lines = output.split('\n');
        const summaryLine = lines.find((line) =>
          line.match(/^\d+ specs?, \d+ failures?/)
        );
        const timeLine = lines.find((line) => line.match(/^Finished in \d+/));

        console.log(`\n${label}:`);
        if (summaryLine) console.log(`  ${summaryLine.trim()}`);
        if (timeLine) console.log(`  ${timeLine.trim()}`);
      }

      // Show pending tests if any
      function showPending(output, label) {
        if (!output?.length) {
          return;
        }
        const lines = output.split('\n');
        const pendingIndex = lines.findIndex(
          (line) => line.trim() === 'Pending:'
        );
        if (pendingIndex !== -1) {
          console.log(`\n${label} Pending Tests:`);
          for (let i = pendingIndex + 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (
              line &&
              !line.match(/^\d+ specs?, \d+ failures?/) &&
              !line.match(/^Finished in \d+/)
            ) {
              console.log(`  ${line}`);
            }
          }
        }
      }

      console.log('\n' + '='.repeat(80));
      console.log('📊 SYNCHRONIZED TEST RESULTS\n');
      extractSummary(testResults.commonJSResult?.output, '📦 CommonJS Results');
      extractSummary(
        testResults.esModuleResult?.output,
        '📦 ES Module Results'
      );
      console.log('\n' + '='.repeat(80));

      console.log('\n' + '='.repeat(80));
      console.log('📊 PENDING TEST(S) RESULTS\n');
      showPending(testResults.commonJSResult?.output, '📦 CommonJS');
      showPending(testResults.esModuleResult?.output, '📦 ES Module Results');
      console.log('\n' + '='.repeat(80));
    };

    try {
      await runTestsSynchronously();
      // Display synchronized results
      displaySynchronizedResults();
      console.log('🎉 All integration tests completed successfully!');
    } catch (error) {
      console.error('❌ One or more test suites failed:', error.message);
      // Still show results if we have them
      if (testResults.commonJSResult || testResults.esModuleResult) {
        displaySynchronizedResults();
      }
      // Ensure all processes are terminated
      await killTestProcess();
      throw error;
    }

    // Step 6: Graceful shutdown and cleanup
    console.log('✅ Tests completed, shutting down server and cleaning up...');
    await shutdown();
    process.exit(0);
  } catch (error) {
    console.error('❌ Integration tests failed:', error.message);
    await shutdown();
    process.exit(1);
  }
}

// Only run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runIntegrationTests();
}

export { runIntegrationTests, shutdown };
