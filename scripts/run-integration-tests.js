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

let serverProcess = null;
let commonJSProcess = null;
let esModuleProcess = null;

let cleanupRan = false;
let stoppingTestProcesses = false;
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
const killAllTestProcesses = async () => {
  // Already cleaning up
  if (stoppingTestProcesses) {
    return;
  }
  stoppingTestProcesses = true;

  // invoke once per child test process
  const terminateProcess = (proc, label) => {
    if (!proc || proc.exitCode !== null) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      console.log(`🛑 Killing ${label} test process...`);

      const forceKillTimeout = setTimeout(() => {
        if (proc.exitCode === null) {
          console.log(`⚡ Forcing kill of ${label} test process...`);
          proc.kill('SIGKILL');
        }
      }, 5000);

      // calling SIGTERM or SIGKILL invokes this handler
      proc.once('exit', () => {
        console.log(`✅ ${label} test process exited.`);
        clearTimeout(forceKillTimeout);
        resolve();
      });

      proc.kill('SIGTERM');
    });
  };

  console.log('🛑 Terminating all test processes immediately...');
  await Promise.all([
    terminateProcess(commonJSProcess, 'CommonJS'),
    terminateProcess(esModuleProcess, 'ES Module')
  ]);
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

  await killAllTestProcesses();
  await runDeleteTestProperties();

  if (serverProcess && serverProcess.exitCode === null) {
    console.log('🛑 Script asking to shut down the web server...');

    const waitForExpressToStop = new Promise((resolve) => {
      const childProcessHanging = setTimeout(() => {
        if (serverProcess.exitCode === null) {
          console.log('⚡ Parent process must force-kill the web server...');
          serverProcess.kill('SIGKILL');
          resolve();
        }
      }, 5000);

      serverProcess.once('exit', () => {
        clearTimeout(childProcessHanging);
        console.log('✅ Parent got the server to stop with Graceful shutdown');
        resolve();
      });
    });

    serverProcess.kill('SIGTERM');
    await waitForExpressToStop;
  }
}

// Register process handlers
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
// Register process handlers

/**
 * Spin up the test server. Spin up multiple processes to run the tests in parallel.
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

    // Step 2: Start web server
    console.log('Starting web server on port 5000...');
    serverProcess = spawn(
      'node',
      ['scripts/static-server.js', '--port', '5000', '--dir', 'tmp.tests'],
      {
        stdio: ['inherit', 'pipe', 'pipe']
      }
    );

    // Handles spawning the server
    serverProcess.on('error', async (err) => {
      console.error('❌ Failed to start web server:', err);
      await shutdown();
      process.exit(1);
    });

    // listen to server messages
    serverProcess.stdout.on('data', (data) => {
      console.log(`Server: ${data.toString().trim()}`);
    });
    serverProcess.stderr.on('data', (data) => {
      console.error(`Server error: ${data.toString().trim()}`);
    });

    // Step 3: Wait for server to be ready
    console.log('Waiting for server to start...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Step 4: Run Node.js integration tests in parallel with synchronized reporting
    console.log('🚀 Running Node.js integration tests in parallel...');

    // Buffer output for synchronized reporting
    let commonJSOutput = '';
    let esModuleOutput = '';
    let commonJSResult = null;
    let esModuleResult = null;

    const runCommonJSTests = () => {
      return new Promise((resolve, reject) => {
        console.log('Starting CommonJS tests...');
        commonJSProcess = spawn('jasmine', ['tmp.tests/commonjs/index.cjs'], {
          stdio: ['inherit', 'pipe', 'pipe']
        });

        commonJSProcess.stdout.on('data', (data) => {
          if (!stoppingTestProcesses) {
            const output = data.toString();
            commonJSOutput += output;
            // Only show real-time output, not the summary
            const lines = output.split('\n');
            lines.forEach((line) => {
              line = line.trim();
              if (
                line &&
                !line.match(/^\d+ specs?, \d+ failures?/) &&
                !line.match(/^Finished in \d+/) &&
                !line.match(/^Pending:$/)
              ) {
                console.log(`[CommonJS] ${line}`);
              }
            });
          }
        });

        commonJSProcess.stderr.on('data', (data) => {
          if (!stoppingTestProcesses) {
            console.error(`[CommonJS Error] ${data.toString().trim()}`);
          }
        });
        commonJSProcess.on('close', (code) => {
          if (stoppingTestProcesses) {
            return;
          }

          commonJSResult = { code, output: commonJSOutput };

          if (code === 0) {
            console.log('✅ CommonJS integration tests completed successfully');
            resolve();
          } else {
            console.error(
              `❌ CommonJS integration tests failed with exit code ${code}`
            );
            killAllTestProcesses();
            reject(new Error(`CommonJS tests failed with exit code ${code}`));
          }
        });
        commonJSProcess.on('error', (error) => {
          if (stoppingTestProcesses) {
            return;
          }

          console.error('❌ Failed to start CommonJS jasmine:', error.message);
          killAllTestProcesses();
          reject(error);
        });
      });
    };

    const runESModuleTests = () => {
      return new Promise((resolve, reject) => {
        console.log('Starting ES Module tests...');
        esModuleProcess = spawn('jasmine', ['tmp.tests/esmodule/index.js'], {
          stdio: ['inherit', 'pipe', 'pipe']
        });

        esModuleProcess.stdout.on('data', (data) => {
          if (!stoppingTestProcesses) {
            const output = data.toString();
            esModuleOutput += output;
            // Only show real-time output, not the summary
            const lines = output.split('\n');
            lines.forEach((line) => {
              line = line.trim();
              if (
                line &&
                !line.match(/^\d+ specs?, \d+ failures?/) &&
                !line.match(/^Finished in \d+/) &&
                !line.match(/^Pending:$/)
              ) {
                console.log(`[ESModule] ${line}`);
              }
            });
          }
        });

        esModuleProcess.stderr.on('data', (data) => {
          if (!stoppingTestProcesses) {
            console.error(`[ESModule Error] ${data.toString().trim()}`);
          }
        });
        esModuleProcess.on('close', (code) => {
          if (stoppingTestProcesses) {
            return;
          }

          esModuleResult = { code, output: esModuleOutput };

          if (code === 0) {
            console.log(
              '✅ ES Module integration tests completed successfully'
            );
            resolve();
          } else {
            console.error(
              `❌ ES Module integration tests failed with exit code ${code}`
            );
            killAllTestProcesses();
            reject(new Error(`ES Module tests failed with exit code ${code}`));
          }
        });
        esModuleProcess.on('error', (error) => {
          if (stoppingTestProcesses) {
            return;
          }

          console.error('❌ Failed to start ES Module jasmine:', error.message);
          killAllTestProcesses();
          reject(error);
        });
      });
    };

    const displaySynchronizedResults = () => {
      // Extract and display summary information for both
      if (commonJSResult && esModuleResult) {
        const extractSummary = (output, label) => {
          const lines = output.split('\n');
          const summaryLine = lines.find((line) =>
            line.match(/^\d+ specs?, \d+ failures?/)
          );
          const timeLine = lines.find((line) => line.match(/^Finished in \d+/));

          console.log(`\n${label}:`);
          if (summaryLine) console.log(`  ${summaryLine.trim()}`);
          if (timeLine) console.log(`  ${timeLine.trim()}`);
        };

        console.log('\n' + '='.repeat(80));
        console.log('📊 SYNCHRONIZED TEST RESULTS\n');
        extractSummary(commonJSResult.output, '📦 CommonJS Results');
        extractSummary(esModuleResult.output, '📦 ES Module Results');
        console.log('='.repeat(80));

        // Show pending tests if any
        const showPending = (output, label) => {
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
        };

        showPending(commonJSResult.output, '📦 CommonJS');
        showPending(esModuleResult.output, '📦 ES Module');
      }

      console.log('\n' + '='.repeat(80));
    };

    // Run both test suites in parallel with immediate failure handling
    try {
      await Promise.all([runCommonJSTests(), runESModuleTests()]);

      // Display synchronized results
      displaySynchronizedResults();

      console.log('🎉 All integration tests completed successfully!');
    } catch (error) {
      console.error('❌ One or more test suites failed:', error.message);

      // Still show results if we have them
      if (commonJSResult || esModuleResult) {
        displaySynchronizedResults();
      }

      // Ensure all processes are terminated
      await killAllTestProcesses();
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
