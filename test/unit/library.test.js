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

describe('Library:', function() {
  const context = jasmine.getEnv().reactorContext;
  const reactor = context.reactor;
  const propertyId = 'PR00000000000000000000000000000000';
  const libraryId = 'LB12341234123412341234123412341234';

  describe('createLibrary', function() {
    it('runs an http POST', async function() {
      const library = {
        attributes: {
          name: `Awesome Library ${new Date().getTime()}`
        },
        type: 'libraries'
      };
      context.expectRequest(
        'post',
        `/properties/${propertyId}/libraries`,
        library
      );
      await reactor.createLibrary(propertyId, library);
    });
  });

  describe('updateLibrary', function() {
    it('runs an http PATCH', async function() {
      const libraryPatch = {
        id: libraryId,
        attributes: {
          name: `Awesome Library ${new Date().getTime()}`
        },
        type: 'libraries'
      };
      context.expectRequest('patch', `/libraries/${libraryId}`, libraryPatch);
      await reactor.updateLibrary(libraryPatch);
    });
  });

  describe('getLibrary', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/libraries/${libraryId}`);
      await reactor.getLibrary(libraryId);
    });
  });

  describe('listLibrariesForProperty', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/properties/${propertyId}/libraries`);
      await reactor.listLibrariesForProperty(propertyId);
    });
    it('runs an http GET with query parameters', async function() {
      context.expectRequest(
        'get',
        `/properties/${propertyId}/libraries?filter%5Bname%5D=EQ+Delta%2CEQ+Bravo&sort=-name`
      );
      await reactor.listLibrariesForProperty(propertyId, {
        'filter[name]': 'EQ Delta,EQ Bravo',
        sort: '-name'
      });
    });
  });

  describe('deleteLibrary', function() {
    it('runs an http DELETE', async function() {
      context.expectRequest('delete', `/libraries/${libraryId}`);
      await reactor.deleteLibrary(libraryId);
    });
  });

  describe('transitionLibrary', function() {
    it('runs an http PATCH', async function() {
      const action = 'submit';
      const expectedBody = {
        data: {
          id: libraryId,
          type: 'libraries',
          meta: {
            action
          }
        }
      };
      context.expectRequest('patch', `/libraries/${libraryId}`, expectedBody);
      await reactor.transitionLibrary(libraryId, action);
    });
  });

  describe('setEnvironmentRelationshipForLibrary', function() {
    it('runs an http PATCH', async function() {
      const environmentId = 'EN00000000000000000000000000000000';
      const expectedBody = {
        data: {
          id: environmentId,
          type: 'environments'
        },
        id: libraryId
      };
      context.expectRequest(
        'patch',
        `/libraries/${libraryId}/relationships/environment`,
        expectedBody
      );
      await reactor.setEnvironmentRelationshipForLibrary(
        libraryId,
        environmentId
      );
    });
  });

  describe('deleteLibraryEnvironmentRelationship', function() {
    it('runs an http DELETE', async function() {
      const environmentId = 'EN00000000000000000000000000000000';
      const expectedBody = {
        data: {
          id: environmentId,
          type: 'environments'
        },
        id: libraryId
      };
      context.expectRequest(
        'delete',
        `/libraries/${libraryId}/relationships/environment`,
        expectedBody
      );
      await reactor.removeEnvironmentRelationshipFromLibrary(
        libraryId,
        environmentId
      );
    });
  });
});
