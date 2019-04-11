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
helpers.describe('Adapter API', function() {
  var theTestProperty;
  async function makeOrReuseTheTestProperty() {
    if (!theTestProperty) {
      theTestProperty = await helpers.createTestProperty(
        'Adapter-Testing Base'
      );
    }
    return theTestProperty;
  }

  async function newAdapter(adapterName) {
    const theProperty = await makeOrReuseTheTestProperty();
    return await helpers.createTestSftpAdapter(theProperty.id, adapterName);
  }

  // Create an Adapter
  // https://developer.adobelaunch.com/api/adapters/create/
  helpers.it('creates a new Adapter', async function() {
    const adapter = await newAdapter('Diamond');
    expect(adapter.id).toMatch(helpers.idAD);
  });

  // Delete an Adapter
  // https://developer.adobelaunch.com/api/adapters/delete/
  helpers.it('deletes an Adapter', async function() {
    const adapter = await newAdapter('Emerald');
    const deleteResponse = await reactor.deleteAdapter(adapter.id); //then delete
    expect(deleteResponse).toBe(null);
    try {
      await reactor.getAdapter(adapter.id);
      fail('getting a deleted adapter should fail');
    } catch (error) {
      expect(error.status).toBe(404);
    }
  });

  // Get an Adapter
  // https://developer.adobelaunch.com/api/adapters/fetch/
  helpers.it('gets an Adapter', async function() {
    const adapter = await newAdapter('Citrine');
    const response = await reactor.getAdapter(adapter.id);
    const found = response.data;
    expect(found.attributes.name).toMatch(/citrine/i);
  });

  // Get the Property
  // https://developer.adobelaunch.com/api/adapters/property/
  helpers.it("gets an Adapter's Property", async function() {
    const theProperty = await makeOrReuseTheTestProperty();
    const adapter = await newAdapter('Saphire');
    const response = await reactor.getPropertyForAdapter(adapter.id);
    expect(response.data.id).toBe(theProperty.id);
  });

  // List Adapters for a Property
  // https://developer.adobelaunch.com/api/adapters/list/
  helpers.it('lists all Adapters', async function() {
    const theProperty = await makeOrReuseTheTestProperty();
    const catseye = await newAdapter('Catseye');
    const apatite = await newAdapter('Apatite');
    const listResponse = await reactor.listAdaptersForProperty(theProperty.id);
    const allIds = listResponse.data.map(resource => resource.id);
    expect(allIds).toContain(catseye.id);
    expect(allIds).toContain(apatite.id);
  });

  // List Adapters for a Property, with filter and sort
  // List:   https://developer.adobelaunch.com/api/adapters/list/
  // Filter: https://developer.adobelaunch.com/guides/api/filtering/
  // Sort:   https://developer.adobelaunch.com/guides/api/sorting/
  helpers.it('lists filtered Adapters', async function() {
    const theProperty = await makeOrReuseTheTestProperty();
    const larimar = await newAdapter('Larimar');
    const peridot = await newAdapter('Peridot');
    const kunzite = await newAdapter('Kunzite');
    var filteredResponse = await reactor.listAdaptersForProperty(
      theProperty.id,
      {
        'filter[name]': 'LIKE erido,LIKE nzite',
        sort: '-name'
      }
    );
    const adapterNames = filteredResponse.data.map(
      resource => resource.attributes.name
    );
    expect(adapterNames.length).toBe(2);
    expect(adapterNames).toEqual([
      peridot.attributes.name,
      kunzite.attributes.name
    ]);
  });

  // Update an Adapter
  // https://developer.adobelaunch.com/api/adapters/update/
  helpers.it('updates an Adapter', async function() {
    const adapter = await newAdapter('Verdite');
    let response = await reactor.updateAdapter({
      attributes: {
        name: adapter.attributes.name.replace('Verdite', 'Verdite Updated'),
        username: 'John Hancock'
      },
      id: adapter.id,
      type: 'adapters'
    });
    const updatedAdapter = response.data;
    expect(updatedAdapter.id).toBe(adapter.id);
    expect(updatedAdapter.attributes.name).toMatch('Verdite Updated');
    expect(updatedAdapter.attributes.username).toEqual('John Hancock');

    response = await reactor.getAdapter(adapter.id);
    const oldAdapter = response.data;
    expect(oldAdapter.attributes.name).toMatch('Verdite Updated');
    expect(oldAdapter.attributes.username).toEqual('John Hancock');
  });
});
