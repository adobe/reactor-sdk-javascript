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

import { createReviseBody } from '../../';

describe('Extension:', function() {
  const context = jasmine.getEnv().reactorContext;
  const reactor = context.reactor;
  const propertyId = 'PR123';
  const extensionId = 'EX123';

  describe('createExtension', function() {
    it('runs an http POST', async function() {
      const extension = {
        attributes: {
          enabled: true
        },
        type: 'extensions'
      };
      context.expectRequest(
        'post',
        `/properties/${propertyId}/extensions`,
        extension
      );
      await reactor.createExtension(propertyId, extension);
    });
  });

  describe('updateExtension', function() {
    it('runs an http PATCH', async function() {
      const patch = {
        data: {
          id: extensionId,
          attributes: { enabled: false },
          type: 'extensions'
        }
      };
      context.expectRequest('patch', `/extensions/${extensionId}`, patch);
      await reactor.updateExtension(extensionId, patch);
    });
  });

  describe('reviseExtension', function() {
    it('runs an http PATCH', async function() {
      const reviseBody = createReviseBody('extensions', extensionId);
      context.expectRequest('patch', `/extensions/${extensionId}`, reviseBody);
      await reactor.reviseExtension(extensionId);
    });
  });

  describe('getExtension', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/extensions/${extensionId}`);
      await reactor.getExtension(extensionId);
    });
  });

  describe('listRevisionsForExtension', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/extensions/${extensionId}/revisions`);
      await reactor.listRevisionsForExtension(extensionId);
    });
  });

  describe('listExtensionsForProperty', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/properties/${propertyId}/extensions`);
      await reactor.listExtensionsForProperty(propertyId);
    });
    it('runs an http GET with query parameters', async function() {
      context.expectRequest(
        'get',
        `/properties/${propertyId}/extensions?filter%5Bname%5D=EQ+Delta%2CEQ+Bravo&sort=-name`
      );
      await reactor.listExtensionsForProperty(propertyId, {
        'filter[name]': 'EQ Delta,EQ Bravo',
        sort: '-name'
      });
    });
  });

  describe('deleteExtension', function() {
    it('runs an http DELETE', async function() {
      context.expectRequest('delete', `/extensions/${extensionId}`);
      await reactor.deleteExtension(extensionId);
    });
  });
});
