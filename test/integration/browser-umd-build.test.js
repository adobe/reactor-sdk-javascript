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

import helpers from './helpers';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

// Use process.cwd() to get the project root and build the path from there
// The __dirname output was getting mangled with the way the tests are set up.
const bundlePath = path.join(process.cwd(), 'dist', 'reactor-sdk.min.js');

helpers.describe('Browser Global Bundle', () => {
  let window;
  let dom;

  beforeAll(async () => {
    expect(fs.existsSync(bundlePath)).toBeTrue();

    // Create a new JSDOM instance to simulate a browser environment
    dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`, {
      runScripts: 'dangerously', // allow script execution
      resources: 'usable', // allow resource loading
      url: 'http://localhost' // set a base url
    });
    window = dom.window;

    // Add missing browser globals that the bundle expects
    window.Headers = window.Headers || class Headers {};
    window.fetch =
      window.fetch ||
      (() => Promise.reject(new Error('fetch not available in test')));

    const scriptContent = fs.readFileSync(bundlePath, 'utf-8');

    // Create and execute script element directly in JSDOM
    const scriptEl = window.document.createElement('script');
    scriptEl.textContent = scriptContent;

    try {
      window.document.head.appendChild(scriptEl);
    } catch (error) {
      console.error('Script execution error:', error.message);
      // If direct execution fails, try manual assignment
      // Extract the Reactor class from the bundle and assign it manually
      if (scriptContent.includes('window.Reactor')) {
        try {
          // Execute the script content in a try-catch to handle the Headers error
          const safeScript = scriptContent.replace(
            /typeof window !== 'undefined'/g,
            'typeof window !== "undefined" && window'
          );
          eval(`(function() { ${safeScript} }).call(window)`);
        } catch (evalError) {
          console.error('Eval execution also failed:', evalError.message);
        }
      }
    }

    // Wait a bit for any asynchronous initialization. Can't use onLoad here.
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  helpers.it('should attach Reactor to the window object', () => {
    expect(window.Reactor).toBeDefined();
    expect(typeof window.Reactor).toBe('function');

    const instance = new window.Reactor('fake-token');
    expect(instance).toBeDefined();
    expect(typeof instance.listCompanies).toBe('function');
  });
});
