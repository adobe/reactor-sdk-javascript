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

import reactor from './reactor';
import helpers from './helpers';

// Adapters
// https://developer.adobelaunch.com/api/adapters/
describe('Adapter API', function() {
  var theProperty;
  var diamond;
  var emerald;
  var citrine;
  var saphire;
  var catseye;

  beforeAll(async function() {
    try {
      theProperty = await helpers.createTestProperty('Adapter-Testing Base');
      diamond = await helpers.createTestAdapter(theProperty.id, 'Diamond');
      emerald = await helpers.createTestAdapter(theProperty.id, 'Emerald');
      citrine = await helpers.createTestAdapter(theProperty.id, 'Citrine');
      saphire = await helpers.createTestAdapter(theProperty.id, 'Saphire');
      catseye = await helpers.createTestAdapter(theProperty.id, 'Catseye');
    } catch (error) {
      helpers.specName = 'Adapter beforeAll';
      helpers.reportError(error);
    }
  });

  afterAll(async function() {
    if (theProperty && theProperty.id) {
      await reactor.deleteProperty(theProperty.id);
    }
  });

  //  var originalTimeout;
  //
  //  beforeEach(function() {
  //    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  //    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  //  });
  //
  //  afterEach(function() {
  //    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  //  });

  // Create an Adapter
  // https://developer.adobelaunch.com/api/adapters/create/
  helpers.it('creates a new Adapter', function() {
    // Five adapters should have been created in beforeAll().
    expect(diamond.id).toMatch(helpers.idAD);
    expect(emerald.id).toMatch(helpers.idAD);
    expect(citrine.id).toMatch(helpers.idAD);
    expect(saphire.id).toMatch(helpers.idAD);
    expect(catseye.id).toMatch(helpers.idAD);
  });

  // Delete an Adapter
  // https://developer.adobelaunch.com/api/adapters/delete/
  helpers.it('deletes an Adapter', async function() {
    const catseye = await helpers.createTestAdapter(theProperty.id, 'Catseye');
    expect(catseye.attributes.name).toMatch(/catseye/i);

    const deleteResponse = await reactor.deleteAdapter(catseye.id);
    expect(deleteResponse).toBe(null);

    try {
      await reactor.getAdapter(catseye.id);
      fail('getting a deleted adapter should fail');
    } catch (error) {
      expect(error.status).toBe(404);
    }
  });

  // Get an Adapter
  // https://developer.adobelaunch.com/api/adapters/fetch/
  helpers.it('gets an Adapter', async function() {
    const response = await reactor.getAdapter(emerald.id);
    const found = response.data;
    expect(found.attributes.name).toMatch(/emerald/i);
  });

  // Get the Property
  // https://developer.adobelaunch.com/api/adapters/property/
  helpers.it("gets an Adapter's Property", async function() {
    const response = await reactor.getPropertyForAdapter(saphire.id);
    expect(response.data.id).toBe(theProperty.id);
  });

  // List Adapters for a Property
  // https://developer.adobelaunch.com/api/adapters/list/
  helpers.it('lists all Adapters', async function() {
    // Make sure all three adapters show up in the list of Adapters on Property
    const listResponse = await reactor.listAdaptersForProperty(theProperty.id);
    const allIds = listResponse.data.map(resource => resource.id);
    expect(allIds).toContain(diamond.id);
    expect(allIds).toContain(emerald.id);
    expect(allIds).toContain(citrine.id);
    expect(allIds).toContain(saphire.id);
    expect(allIds).toContain(catseye.id);
  });

  // List Adapters for a Property, with filter and sort
  // List:   https://developer.adobelaunch.com/api/adapters/list/
  // Filter: https://developer.adobelaunch.com/guides/api/filtering/
  // Sort:   https://developer.adobelaunch.com/guides/api/sorting/
  helpers.it('lists filtered Adapters', async function() {
    var filteredResponse = await reactor.listAdaptersForProperty(
      theProperty.id,
      {
        'filter[name]': 'LIKE mera,LIKE atse,LIKE itri,LIKE aphi',
        sort: '-name'
      }
    );
    const adapterNames = filteredResponse.data.map(
      resource => resource.attributes.name
    );
    expect(adapterNames.length).toBe(4);
    expect(adapterNames).toEqual([
      saphire.attributes.name,
      emerald.attributes.name,
      citrine.attributes.name,
      catseye.attributes.name
    ]);
  });

  // Update an Adapter
  // https://developer.adobelaunch.com/api/adapters/update/
  helpers.it('updates an Adapter', async function() {
    let response = await reactor.updateAdapter({
      attributes: {
        name: diamond.attributes.name.replace('Diamond', 'Diamond Updated'),
        username: 'Diamond Jim Brady'
      },
      id: diamond.id,
      type: 'adapters'
    });
    const updatedAdapter = response.data;
    expect(updatedAdapter.id).toBe(diamond.id);
    expect(updatedAdapter.attributes.name).toMatch('Diamond Updated');
    expect(updatedAdapter.attributes.username).toEqual('Diamond Jim Brady');

    response = await reactor.getAdapter(diamond.id);
    const oldAdapter = response.data;
    expect(oldAdapter.attributes.name).toMatch('Diamond Updated');
    expect(oldAdapter.attributes.username).toEqual('Diamond Jim Brady');
  });
});
