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

describe('Property:', function() {
  const context = jasmine.getEnv().reactorContext;
  const reactor = context.reactor;
  const companyId = 'CO123';
  const propertyId = 'PR123';

  describe('createProperty', function() {
    it('runs an http POST', async function() {
      const property = {
        attributes: {
          domains: ['adobe.com'],
          name: `Awesome Property ${new Date().getTime()}`,
          platform: 'web',
          type: 'properties'
        },
        type: 'properties'
      };
      context.expectRequest(
        'post',
        `/companies/${companyId}/properties`,
        property
      );
      await reactor.createProperty(companyId, property);
    });
  });

  describe('listPropertiesForCompany', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/companies/${companyId}/properties`);
      await reactor.listPropertiesForCompany(companyId);
    });
    it('runs an http GET with query parameters', async function() {
      context.expectRequest(
        'get',
        `/companies/${companyId}/properties?filter%5Bname%5D=EQ+Delta%2CEQ+Bravo&sort=-name`
      );
      await reactor.listPropertiesForCompany(companyId, {
        'filter[name]': 'EQ Delta,EQ Bravo',
        sort: '-name'
      });
    });
  });

  describe('getProperty', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/properties/${propertyId}`);
      await reactor.getProperty(propertyId);
    });
  });

  describe('updateProperty', function() {
    it('runs an http PATCH', async function() {
      const propertyPatch = {
        id: propertyId,
        attributes: { name: `Updated Property ${new Date().getTime()}` },
        type: 'properties'
      };
      context.expectRequest(
        'patch',
        `/properties/${propertyId}`,
        propertyPatch
      );
      await reactor.updateProperty(propertyPatch);
    });
  });

  describe('deleteProperty', function() {
    it('runs an http DELETE', async function() {
      context.expectRequest('delete', `/properties/${propertyId}`);
      await reactor.deleteProperty(propertyId);
    });
  });

  describe('createPropertyNote', function() {
    it('runs an http POST', async function() {
      const post = {
        type: 'notes',
        attributes: {
          text: 'this note on a property intentionally left blank'
        }
      };
      context.expectRequest('post', `/properties/${propertyId}/notes`, post);
      await reactor.createNoteForProperty(propertyId, post);
    });
  });
});
