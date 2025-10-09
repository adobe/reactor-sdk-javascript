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

import ReactorESM from '../../lib/node/index.js';
import { createRequire } from 'module';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

describe('Package Exports:', function () {
  describe('ESM Import', function () {
    it('should successfully import the ESM version', function () {
      // Verify it's a valid Reactor SDK instance
      expect(ReactorESM).toBeDefined();
      expect(typeof ReactorESM).toBe('function');

      // Test that we can create an instance
      const reactorInstance = new ReactorESM('fake-token');
      expect(reactorInstance).toBeDefined();
      expect(typeof reactorInstance.createProperty).toBe('function');
      expect(typeof reactorInstance.listCompanies).toBe('function');
    });

    it('should have expected API methods', function () {
      const reactorInstance = new ReactorESM('fake-token');

      // Verify some key methods exist
      const expectedMethods = [
        'createProperty',
        'listCompanies',
        'getProperty',
        'createEnvironment',
        'listLibrariesForProperty'
      ];

      expectedMethods.forEach((method) => {
        expect(typeof reactorInstance[method]).toBe('function');
      });
    });

    it('should have version information', function () {
      const reactorInstance = new ReactorESM('fake-token');

      // Should have a version property
      expect(reactorInstance.version).toBeDefined();
    });
  });

  describe('CommonJS Require', function () {
    it('should successfully require the CommonJS version', function () {
      // Require the CommonJS version using createRequire - now with .cjs extension
      const ReactorCJS = require('../../lib/cjs/index.cjs');

      // Verify it's a valid Reactor SDK instance
      expect(ReactorCJS.default).toBeDefined();
      expect(typeof ReactorCJS.default).toBe('function');

      // Test that we can create an instance
      const reactorInstance = new ReactorCJS.default('fake-token');
      expect(reactorInstance).toBeDefined();
      expect(typeof reactorInstance.createProperty).toBe('function');
      expect(typeof reactorInstance.listCompanies).toBe('function');
    });

    it('should have expected API methods for CommonJS', function () {
      const ReactorCJS = require('../../lib/cjs/index.cjs');
      const reactorInstance = new ReactorCJS.default('fake-token');

      // Verify some key methods exist
      const expectedMethods = [
        'createProperty',
        'listCompanies',
        'getProperty',
        'createEnvironment',
        'listLibrariesForProperty'
      ];

      expectedMethods.forEach((method) => {
        expect(typeof reactorInstance[method]).toBe('function');
      });
    });

    it('should have version information for CommonJS', function () {
      const ReactorCJS = require('../../lib/cjs/index.cjs');
      const reactorInstance = new ReactorCJS.default('fake-token');

      // Should have a version property
      expect(reactorInstance.version).toBeDefined();
    });

    it('should support dynamic require', function () {
      const modulePath = resolve(__dirname, '../../lib/cjs/index.cjs');
      const ReactorCJS = require(modulePath);

      expect(ReactorCJS.default).toBeDefined();
      expect(typeof ReactorCJS.default).toBe('function');
    });
  });

  describe('Cross-Module Consistency', function () {
    it('should have consistent APIs between ESM and CommonJS', function () {
      const ReactorCJS = require('../../lib/cjs/index.cjs');

      // Create instances from both module systems
      const esmInstance = new ReactorESM('fake-token');
      const cjsInstance = new ReactorCJS.default('fake-token');

      // Get method names from both instances
      const esmMethods = Object.getOwnPropertyNames(
        Object.getPrototypeOf(esmInstance)
      )
        .filter(
          (name) =>
            typeof esmInstance[name] === 'function' && name !== 'constructor'
        )
        .sort();

      const cjsMethods = Object.getOwnPropertyNames(
        Object.getPrototypeOf(cjsInstance)
      )
        .filter(
          (name) =>
            typeof cjsInstance[name] === 'function' && name !== 'constructor'
        )
        .sort();

      // Both should have the same API methods
      expect(new Set(esmMethods)).toEqual(new Set(cjsMethods));
    });

    it('should have the same version in both module formats', function () {
      const ReactorCJS = require('../../lib/cjs/index.cjs');

      const esmInstance = new ReactorESM('fake-token');
      const cjsInstance = new ReactorCJS.default('fake-token');

      // Both should have the same version
      expect(esmInstance.version).toBeDefined();
      expect(cjsInstance.version).toBeDefined();
      expect(esmInstance.version).toEqual(cjsInstance.version);
    });
  });
});
