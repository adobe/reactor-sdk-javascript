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

describe('DataElement:', function() {
  const context = jasmine.getEnv().reactorContext;
  const reactor = context.reactor;
  const propertyId = 'PR123';
  const dataElementId = 'DE123';

  describe('createDataElement', function() {
    it('runs an http POST', async function() {
      const dataElement = {
        attributes: {
          name: `Data Element ${new Date().getTime()}`
        },
        type: 'data_elements'
      };
      context.expectRequest(
        'post',
        `/properties/${propertyId}/data_elements`,
        dataElement
      );
      await reactor.createDataElement(propertyId, dataElement);
    });
  });

  describe('updateElement', function() {
    it('runs an http PATCH', async function() {
      const dataElementPatch = {
        id: dataElementId,
        attributes: {
          name: `Updated DataElement ${new Date().getTime()}`
        },
        type: 'data_elements'
      };
      context.expectRequest(
        'patch',
        `/data_elements/${dataElementId}`,
        dataElementPatch
      );
      await reactor.updateDataElement(dataElementPatch);
    });
  });

  describe('reviseDataElement', function() {
    it('runs an http PATCH', async function() {
      const reviseBody = createReviseBody('data_elements', dataElementId);
      context.expectRequest(
        'patch',
        `/data_elements/${dataElementId}`,
        reviseBody
      );
      await reactor.reviseDataElement(dataElementId);
    });
  });

  describe('getDataElement', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/data_elements/${dataElementId}`);
      await reactor.getDataElement(dataElementId);
    });
  });

  describe('listRevisionsForDataElement', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/data_elements/${dataElementId}/revisions`);
      await reactor.listRevisionsForDataElement(dataElementId);
    });
  });

  describe('listDataElementsForProperty', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/properties/${propertyId}/data_elements`);
      await reactor.listDataElementsForProperty(propertyId);
    });
    it('runs an http GET with query parameters', async function() {
      context.expectRequest(
        'get',
        `/properties/${propertyId}/data_elements?filter%5Bname%5D=EQ+Delta%2CEQ+Bravo&sort=-name`
      );
      await reactor.listDataElementsForProperty(propertyId, {
        'filter[name]': 'EQ Delta,EQ Bravo',
        sort: '-name'
      });
    });
  });

  describe('deleteDataElement', function() {
    it('runs an http DELETE', async function() {
      context.expectRequest('delete', `/data_elements/${dataElementId}`);
      await reactor.deleteDataElement(dataElementId);
    });
  });
});
