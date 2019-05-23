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

describe('Host:', function() {
  const context = jasmine.getEnv().reactorContext;
  const reactor = context.reactor;
  const propertyId = 'CO123';
  const hostId = 'HT123';

  describe('createHost', function() {
    it('runs an http POST', async function() {
      const host = {
        attributes: {
          name: `Awesome Host ${new Date().getTime()}`,
          type_of: 'sftp'
        },
        type: 'hosts'
      };
      context.expectRequest('post', `/properties/${propertyId}/hosts`, host);
      await reactor.createHost(propertyId, host);
    });
  });

  describe('listHostsForProperty', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/properties/${propertyId}/hosts`);
      await reactor.listHostsForProperty(propertyId);
    });

    it('runs an http GET with query parameters', async function() {
      context.expectRequest(
        'get',
        `/properties/${propertyId}/hosts?filter%5Bname%5D=EQ+Delta%2CEQ+Bravo&sort=-name`
      );
      await reactor.listHostsForProperty(propertyId, {
        'filter[name]': 'EQ Delta,EQ Bravo',
        sort: '-name'
      });
    });
  });

  describe('getHost', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/hosts/${hostId}`);
      await reactor.getHost(hostId);
    });
  });

  describe('updateHost', function() {
    it('runs an http PATCH', async function() {
      const hostPatch = {
        id: hostId,
        attributes: { name: `Updated Host ${new Date().getTime()}` },
        type: 'hosts'
      };
      context.expectRequest('patch', `/hosts/${hostId}`, hostPatch);
      await reactor.updateHost(hostPatch);
    });
  });

  describe('deleteHost', function() {
    it('runs an http DELETE', async function() {
      context.expectRequest('delete', `/hosts/${hostId}`);
      await reactor.deleteHost(hostId);
    });
  });
});
