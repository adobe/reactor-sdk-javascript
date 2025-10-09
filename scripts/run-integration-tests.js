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

    // Step 5: Run Node.js integration tests
    console.log('🚀 Running Node.js integration tests...');
    await new Promise((resolve, reject) => {
      const jasmine = spawn(
        'jasmine',
        ['tmp.tests/integration-in-node/integration-tests-library-sdk.js'],
        {
          stdio: 'inherit'
        }
      );

      jasmine.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Node.js integration tests completed successfully');
          resolve();
        } else {
          console.error(
            `❌ Node.js integration tests failed with exit code ${code}`
          );
          reject(new Error(`Tests failed with exit code ${code}`));
        }
      });

      jasmine.on('error', (error) => {
        console.error('❌ Failed to start jasmine:', error.message);
        reject(error);
      });
    });

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
