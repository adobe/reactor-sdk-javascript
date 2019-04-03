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

describe('ExtensionPackage:', function() {
  const context = jasmine.getEnv().reactorContext;
  const reactor = context.reactor;
  const extensionPackageId = 'EP123';

  describe('getExtensionPackage', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/extension_packages/${extensionPackageId}`);
      await reactor.getExtensionPackage(extensionPackageId);
    });
  });

  describe('listExtensionPackages', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', '/extension_packages');
      await reactor.listExtensionPackages();
    });
    it('runs an http GET with query parameters', async function() {
      context.expectRequest(
        'get',
        '/extension_packages?filter%5Bname%5D=EQ+Delta%2CEQ+Bravo&sort=-name'
      );
      await reactor.listExtensionPackages({
        'filter[name]': 'EQ Delta,EQ Bravo',
        sort: '-name'
      });
    });
  });
});
