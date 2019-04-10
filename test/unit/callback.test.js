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

describe('Callback:', function() {
  const context = jasmine.getEnv().reactorContext;
  const reactor = context.reactor;
  const propertyId = 'PR123';
  const callbackId = 'CB123';

  describe('createCallback', function() {
    it('runs an http POST', async function() {
      const callback = {
        attributes: {
          url: 'https://www.example.com',
          subscriptions: ['rule.created']
        }
      };
      context.expectRequest(
        'post',
        `/properties/${propertyId}/callbacks`,
        callback
      );
      await reactor.createCallback(propertyId, callback);
    });
  });

  describe('listCallbacksForProperty', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/properties/${propertyId}/callbacks`);
      await reactor.listCallbacksForProperty(propertyId);
    });
    it('runs an http GET with query parameters', async function() {
      context.expectRequest(
        'get',
        `/properties/${propertyId}/callbacks?filter%5Bname%5D=EQ+Delta%2CEQ+Bravo&sort=-name`
      );
      await reactor.listCallbacksForProperty(propertyId, {
        'filter[name]': 'EQ Delta,EQ Bravo',
        sort: '-name'
      });
    });
  });

  describe('getCallback', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/callbacks/${callbackId}`);
      await reactor.getCallback(callbackId);
    });
  });

  describe('updateCallback', function() {
    it('runs an http PATCH', async function() {
      const callbackPatch = {
        attributes: {
          url: 'https://www.example.net',
          subscriptions: ['rule.created', 'build.created']
        },
        id: callbackId,
        type: 'callbacks'
      };
      context.expectRequest('patch', `/callbacks/${callbackId}`, callbackPatch);
      await reactor.updateCallback(callbackPatch);
    });
  });

  describe('deleteCallback', function() {
    it('runs an http DELETE', async function() {
      context.expectRequest('delete', `/callbacks/${callbackId}`);
      await reactor.deleteCallback(callbackId);
    });
  });
});
