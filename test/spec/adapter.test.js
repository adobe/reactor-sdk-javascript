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

describe('Adapter:', function() {
  const context = jasmine.getEnv().reactorContext;
  const reactor = context.reactor;
  const propertyId = 'CO123';
  const adapterId = 'AD123';

  describe('createAdapter', function() {
    it('runs an http POST', async function() {
      const adapter = {
        attributes: {
          name: `Awesome Adapter ${new Date().getTime()}`,
          type_of: 'sftp'
        },
        type: 'adapters'
      };
      context.expectRequest(
        'post',
        `/properties/${propertyId}/adapters`,
        adapter
      );
      await reactor.createAdapter(propertyId, adapter);
    });
  });

  describe('listAdaptersForProperty', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/properties/${propertyId}/adapters`);
      await reactor.listAdaptersForProperty(propertyId);
    });

    it('runs an http GET with query parameters', async function() {
      context.expectRequest(
        'get',
        `/properties/${propertyId}/adapters?filter%5Bname%5D=EQ+Delta%2CEQ+Bravo&sort=-name`
      );
      await reactor.listAdaptersForProperty(propertyId, {
        'filter[name]': 'EQ Delta,EQ Bravo',
        sort: '-name'
      });
    });
  });

  describe('getAdapter', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/adapters/${adapterId}`);
      await reactor.getAdapter(adapterId);
    });
  });

  describe('updateAdapter', function() {
    it('runs an http PATCH', async function() {
      const adapterPatch = {
        id: adapterId,
        attributes: { name: `Updated Adapter ${new Date().getTime()}` },
        type: 'adapters'
      };
      context.expectRequest('patch', `/adapters/${adapterId}`, adapterPatch);
      await reactor.updateAdapter(adapterPatch);
    });
  });

  describe('deleteAdapter', function() {
    it('runs an http DELETE', async function() {
      context.expectRequest('delete', `/adapters/${adapterId}`);
      await reactor.deleteAdapter(adapterId);
    });
  });
});
