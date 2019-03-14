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

describe('Build:', function() {
  const context = jasmine.getEnv().reactorContext;
  const reactor = context.reactor;
  const libraryId = 'LB00000000000000000000000000000000';
  const buildId = 'PR00000000000000000000000000000000';

  describe('createBuild', function() {
    it('runs an http POST', async function() {
      context.expectRequest('post', `/libraries/${libraryId}/builds`);
      await reactor.createBuild(libraryId);
    });
  });

  describe('listBuilds', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/libraries/${libraryId}/builds`);
      await reactor.listBuilds(libraryId);
    });

    it('runs an http GET with query parameters', async function() {
      context.expectRequest(
        'get',
        `/libraries/${libraryId}/builds?filter%5Bname%5D=EQ+Delta%2CEQ+Bravo&sort=-name`
      );
      await reactor.listBuilds(libraryId, {
        'filter[name]': 'EQ Delta,EQ Bravo',
        sort: '-name'
      });
    });
  });

  describe('getBuild', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/builds/${buildId}`);
      await reactor.getBuild(buildId);
    });
  });
});
