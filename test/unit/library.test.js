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

  describe('addExtensionRelationshipsToLibrary', function() {
    const postBody = {
      data: [
        { id: 'EX1234567890123456789042', type: 'extensions' },
        { id: 'EX1234567890123456789077', type: 'extensions' }
      ]
    };
    it('runs an http POST', async function() {
      context.expectRequest(
        'post',
        `/libraries/${libraryId}/relationships/extensions`
      );
      await reactor.addExtensionRelationshipsToLibrary(
        libraryId,
        postBody.data
      );
    });
  });

  describe('addRuleRelationshipsToLibrary', function() {
    const postBody = {
      data: [
        { id: 'RL1234567890123456789042', type: 'rules' },
        { id: 'RL1234567890123456789077', type: 'rules' }
      ]
    };
    it('runs an http POST', async function() {
      context.expectRequest(
        'post',
        `/libraries/${libraryId}/relationships/rules`
      );
      await reactor.addRuleRelationshipsToLibrary(libraryId, postBody.data);
    });
  });

  describe('listExtensionRelationshipsForLibrary', function() {
    it('runs an http GET', async function() {
      context.expectRequest(
        'get',
        `/libraries/${libraryId}/relationships/extensions`
      );
      await reactor.listExtensionRelationshipsForLibrary(libraryId);
    });
    it('runs an http GET with query parameters', async function() {
      context.expectRequest(
        'get',
        `/libraries/${libraryId}/relationships/extensions?filter%5Bname%5D=EQ+Dan`
      );
      await reactor.listExtensionRelationshipsForLibrary(libraryId, {
        'filter[name]': 'EQ Dan'
      });
    });
  });

  describe('listExtensionsForLibrary', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/libraries/${libraryId}/extensions`);
      await reactor.listExtensionsForLibrary(libraryId);
    });
    it('runs an http GET with query parameters', async function() {
      context.expectRequest(
        'get',
        `/libraries/${libraryId}/extensions?filter%5Bname%5D=EQ+Fred&sort=name`
      );
      await reactor.listExtensionsForLibrary(libraryId, {
        'filter[name]': 'EQ Fred',
        sort: 'name'
      });
    });
  });

  describe('listRuleRelationshipsForLibrary', function() {
    it('runs an http GET', async function() {
      context.expectRequest(
        'get',
        `/libraries/${libraryId}/relationships/rules`
      );
      await reactor.listRuleRelationshipsForLibrary(libraryId);
    });
    it('runs an http GET with query parameters', async function() {
      context.expectRequest(
        'get',
        `/libraries/${libraryId}/relationships/rules?filter%5Bname%5D=EQ+Joe&sort=-name`
      );
      await reactor.listRuleRelationshipsForLibrary(libraryId, {
        'filter[name]': 'EQ Joe',
        sort: '-name'
      });
    });
  });

  describe('listRulesForLibrary', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/libraries/${libraryId}/rules`);
      await reactor.listRulesForLibrary(libraryId);
    });
    it('runs an http GET with query parameters', async function() {
      context.expectRequest(
        'get',
        `/libraries/${libraryId}/rules?filter%5Bname%5D=EQ+Gus&sort=-name`
      );
      await reactor.listRulesForLibrary(libraryId, {
        'filter[name]': 'EQ Gus',
        sort: '-name'
      });
    });
  });

  describe('replaceExtensionRelationshipsForLibrary', function() {
    const patchBody = {
      data: [
        { id: 'EX44444444555555556666666677777777', type: 'extensions' },
        { id: 'EX00000000111111111111111188888888', type: 'extensions' }
      ]
    };
    it('runs an http PATCH', async function() {
      context.expectRequest(
        'patch',
        `/libraries/${libraryId}/relationships/extensions`,
        patchBody
      );
      await reactor.replaceExtensionRelationshipsForLibrary(
        libraryId,
        patchBody.data
      );
    });
  });

  describe('replaceRuleRelationshipsForLibrary', function() {
    const patchBody = {
      data: [
        { id: 'RL44444444555555556666666677777777', type: 'rules' },
        { id: 'RL00000000111111111111111188888888', type: 'rules' }
      ]
    };
    it('runs an http PATCH', async function() {
      context.expectRequest(
        'patch',
        `/libraries/${libraryId}/relationships/rules`,
        patchBody
      );
      await reactor.replaceRuleRelationshipsForLibrary(
        libraryId,
        patchBody.data
      );
    });
  });

  describe('removeExtensionRelationshipsFromLibrary', function() {
    const deleteBody = {
      data: [
        { id: 'EX123', type: 'extensions' },
        { id: 'EX456', type: 'extensions' }
      ]
    };
    it('runs an http DELETE', async function() {
      context.expectRequest(
        'delete',
        `/libraries/${libraryId}/relationships/extensions`,
        deleteBody
      );
      await reactor.removeExtensionRelationshipsFromLibrary(
        libraryId,
        deleteBody.data
      );
    });
  });

  describe('removeRuleRelationshipsFromLibrary', function() {
    const deleteBody = {
      data: [
        { id: 'RL99999999444444444444444412345657', type: 'rules' },
        { id: 'RL55555555111111111111111188888888', type: 'rules' }
      ]
    };
    it('runs an http DELETE', async function() {
      context.expectRequest(
        'delete',
        `/libraries/${libraryId}/relationships/rules`,
        deleteBody
      );
      await reactor.removeRuleRelationshipsFromLibrary(
        libraryId,
        deleteBody.data
      );
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

  describe('createLibraryNote', function() {
    it('runs an http POST', async function() {
      const post = {
        type: 'notes',
        attributes: {
          text: 'this note on a library intentionally left blank'
        }
      };
      context.expectRequest('post', `/libraries/${libraryId}/notes`, post);
      await reactor.createNoteForLibrary(libraryId, post);
    });
  });
});
