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

describe('Environment:', function() {
  const context = jasmine.getEnv().reactorContext;
  const reactor = context.reactor;
  const propertyId = 'PR00000000000000000000000000000000';
  const environmentId = 'EN00000000000000000000000000000000';

  describe('createEnvironment', function() {
    it('runs an http POST', async function() {
      const environment = {
        attributes: {
          name: `Environment ${new Date().getTime()}`
        },
        type: 'environments'
      };
      context.expectRequest(
        'post',
        `/properties/${propertyId}/environments`,
        environment
      );
      await reactor.createEnvironment(propertyId, environment);
    });
  });

  describe('updateEnvironment', function() {
    it('runs an http PATCH', async function() {
      const environmentPatch = {
        id: environmentId,
        attributes: {
          name: `Updated Environment ${new Date().getTime()}`
        },
        type: 'environments'
      };
      context.expectRequest(
        'patch',
        `/environments/${environmentId}`,
        environmentPatch
      );
      await reactor.updateEnvironment(environmentPatch);
    });
  });

  describe('getEnvironment', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/environments/${environmentId}`);
      await reactor.getEnvironment(environmentId);
    });
  });

  describe('listEnvironmentsForProperty', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/properties/${propertyId}/environments`);
      await reactor.listEnvironmentsForProperty(propertyId);
    });

    it('runs an http GET with query parameters', async function() {
      context.expectRequest(
        'get',
        `/properties/${propertyId}/environments?filter%5Bname%5D=EQ+Delta%2CEQ+Bravo&sort=-name`
      );
      await reactor.listEnvironmentsForProperty(propertyId, {
        'filter[name]': 'EQ Delta,EQ Bravo',
        sort: '-name'
      });
    });
  });

  describe('deleteEnvironment', function() {
    it('runs an http DELETE', async function() {
      context.expectRequest('delete', `/environments/${environmentId}`);
      await reactor.deleteEnvironment(environmentId);
    });
  });
});
