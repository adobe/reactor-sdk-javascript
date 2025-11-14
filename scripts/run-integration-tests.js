#!/usr/bin/env node
/*
Copyright 2019 Adobe. All rights reserved.
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
let cleanupRan = false;

// Cleanup function that runs the delete-test-properties.js script
async function runDeleteTestProperties() {
  if (cleanupRan) return; // prevent multiple runs
  cleanupRan = true;

  try {
    console.log(
      '🧹 Cleaning up test properties (delete-test-properties.js)...'
    );
    const scriptPath = path.resolve(
      process.cwd(),
      'scripts/delete-test-properties.js'
    );
    const { stdout } = await execAsync(`node ${scriptPath}`);
    if (stdout) console.log(stdout.trim());
    console.log('✅ Cleanup completed');
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  }
}

// Graceful shutdown handler (also runs cleanup)
async function shutdown() {
  await runDeleteTestProperties();

  if (serverProcess) {
    console.log('🛑 Shutting down web server...');
    serverProcess.kill('SIGTERM');

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!serverProcess.killed) {
      console.log('⚡ Force killing web server...');
      serverProcess.kill('SIGKILL');
    }

    console.log('✅ Web server stopped');
  }
}

// Register shutdown handlers
process.on('SIGINT', async () => {
  console.log('\n🔄 Received SIGINT - cleaning up...');
  await shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Received SIGTERM - cleaning up...');
  await shutdown();
  process.exit(0);
});

// Make sure cleanup runs on process exit (normal or error)
process.on('exit', async (code) => {
  // Don't await in exit handler, just run sync cleanup or ignore
  if (!cleanupRan) {
    console.log(`Process exiting with code ${code}, running cleanup...`);
    await runDeleteTestProperties();
  }
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

async function runIntegrationTests() {
  try {
    // Step 1: Run version check
    console.log('🔍 Running version check...');
    try {
      const { stdout } = await execAsync('node scripts/check-version.js');
      if (stdout) console.log(stdout.trim());
    } catch (error) {
      console.error('Version check failed:', error.message);
      throw error;
    }

    // Step 2: Start web server
    console.log('🌐 Starting web server on port 5000...');
    serverProcess = spawn(
      'node',
      ['scripts/static-server.js', '--port', '5000', '--dir', 'tmp.tests'],
      {
        stdio: ['inherit', 'pipe', 'pipe']
      }
    );

    serverProcess.stdout.on('data', (data) => {
      console.log(`Server: ${data.toString().trim()}`);
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(`Server error: ${data.toString().trim()}`);
    });

    // Step 3: Wait for server to be ready
    console.log('⏳ Waiting for server to start...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Step 4: Open browsers (only if not in CI environment)
    if (!process.env.CI && !process.env.HEADLESS) {
      console.log('🌐 Opening browsers...');
      try {
        await execAsync('open http://localhost:5000/integration-library-sdk/');
      } catch (error) {
        console.warn('Could not open library SDK browser:', error.message);
      }
      try {
        await execAsync('open http://localhost:5000/integration-bundled-sdk/');
      } catch (error) {
        console.warn('Could not open bundled SDK browser:', error.message);
      }
    } else {
      console.log('🤖 Skipping browser opening (CI/headless mode)');
    }

    // Step 5: Run Node.js integration tests in parallel with immediate termination on failure
    console.log('🚀 Running Node.js integration tests in parallel...');

    let commonJSProcess = null;
    let esModuleProcess = null;
    let testsFailed = false;

    const killAllTestProcesses = async () => {
      if (testsFailed) return; // Already cleaning up
      testsFailed = true;

      console.log('🛑 Terminating all test processes immediately...');

      if (commonJSProcess && !commonJSProcess.killed) {
        console.log('🛑 Killing CommonJS test process...');
        commonJSProcess.kill('SIGTERM');
        // Force kill if it doesn't respond quickly
        setTimeout(() => {
          if (!commonJSProcess.killed) {
            commonJSProcess.kill('SIGKILL');
          }
        }, 2000);
      }

      if (esModuleProcess && !esModuleProcess.killed) {
        console.log('🛑 Killing ES Module test process...');
        esModuleProcess.kill('SIGTERM');
        // Force kill if it doesn't respond quickly
        setTimeout(() => {
          if (!esModuleProcess.killed) {
            esModuleProcess.kill('SIGKILL');
          }
        }, 2000);
      }

      // Wait for processes to terminate
      await new Promise((resolve) => setTimeout(resolve, 3000));
    };

    const runCommonJSTests = () => {
      return new Promise((resolve, reject) => {
        console.log('📦 Starting CommonJS tests...');
        commonJSProcess = spawn('jasmine', ['tmp.tests/commonjs/index.cjs'], {
          stdio: ['inherit', 'pipe', 'pipe']
        });

        commonJSProcess.stdout.on('data', (data) => {
          if (!testsFailed) {
            console.log(`[CommonJS] ${data.toString().trim()}`);
          }
        });

        commonJSProcess.stderr.on('data', (data) => {
          if (!testsFailed) {
            console.error(`[CommonJS Error] ${data.toString().trim()}`);
          }
        });

        commonJSProcess.on('close', (code) => {
          if (testsFailed) return;

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
          if (testsFailed) return;

          console.error('❌ Failed to start CommonJS jasmine:', error.message);
          killAllTestProcesses();
          reject(error);
        });
      });
    };

    const runESModuleTests = () => {
      return new Promise((resolve, reject) => {
        console.log('📦 Starting ES Module tests...');
        esModuleProcess = spawn('jasmine', ['tmp.tests/esmodule/index.js'], {
          stdio: ['inherit', 'pipe', 'pipe']
        });

        esModuleProcess.stdout.on('data', (data) => {
          if (!testsFailed) {
            console.log(`[ESModule] ${data.toString().trim()}`);
          }
        });

        esModuleProcess.stderr.on('data', (data) => {
          if (!testsFailed) {
            console.error(`[ESModule Error] ${data.toString().trim()}`);
          }
        });

        esModuleProcess.on('close', (code) => {
          if (testsFailed) return;

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
          if (testsFailed) return;

          console.error('❌ Failed to start ES Module jasmine:', error.message);
          killAllTestProcesses();
          reject(error);
        });
      });
    };

    // Run both test suites in parallel with immediate failure handling
    try {
      await Promise.all([runCommonJSTests(), runESModuleTests()]);
      console.log('🎉 All integration tests completed successfully!');
    } catch (error) {
      console.error('❌ One or more test suites failed:', error.message);
      // Ensure all processes are terminated
      await killAllTestProcesses();
      throw error;
    }

    // Step 6: Graceful shutdown and cleanup
    console.log('🧹 Tests completed, shutting down server and cleaning up...');
    await shutdown();

    console.log('🎉 Integration tests completed successfully!');
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
