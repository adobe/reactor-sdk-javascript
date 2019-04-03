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

// Properties
// https://developer.adobelaunch.com/api/properties
helpers.describe('Property API', function() {
  var originalTimeout;
  var newProperty;

  beforeAll(async function() {
    try {
      newProperty = await helpers.createTestProperty('NuProp');
    } catch (error) {
      helpers.specName = 'Property beforeAll';
      helpers.reportError(error);
    }
  });

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  // Create a Property
  // https://developer.adobelaunch.com/api/properties/create/
  helpers.it('creates a new Property', function() {
    // A Property should have been created in beforeAll().
    expect(newProperty.id).toMatch(helpers.idPR);
    expect(newProperty.attributes.name).toMatch(/NuProp/);
  });

  // Delete a Property
  // https://developer.adobelaunch.com/api/properties/delete/
  helpers.it('deletes a Property', async function() {
    const ephemeralProperty = await helpers.createTestProperty('deletable');
    expect(ephemeralProperty.attributes.name).toMatch(/deletable/);

    const deleteResponse = await reactor.deleteProperty(ephemeralProperty.id);
    expect(deleteResponse).toBe(null);

    try {
      const deadProp = await reactor.getProperty(ephemeralProperty.id);
      fail('getting a deleted property should fail');
    } catch (error) {
      expect(error.status).toBe(404);
    }
  });

  // Get a Property
  // https://developer.adobelaunch.com/api/properties/fetch/
  helpers.it('gets a Property', async function() {
    const response = await reactor.getProperty(newProperty.id);
    const oldProperty = response.data;
    expect(oldProperty.attributes.name).toMatch(/NuProp/);
  });

  // Get the Company
  // https://developer.adobelaunch.com/api/properties/company/
  helpers.it("gets a Property's Company", async function() {
    const response = await reactor.getCompanyForProperty(newProperty.id);
    expect(response.data.id).toBe(helpers.companyId);
  });

  // List Properties for a Company
  // https://developer.adobelaunch.com/api/properties/list/
  helpers.it('lists all Properties', async function() {
    async function getPropertyByIdAndCheckName(id, name) {
      const response = await reactor.getProperty(id);
      expect(response.data.attributes.name).toMatch(name);
    }

    // Create four Properties
    const atlanta = await helpers.createTestProperty('Atlanta');
    const barstow = await helpers.createTestProperty('Barstow');
    const chicago = await helpers.createTestProperty('Chicago');
    const detroit = await helpers.createTestProperty('Detroit');
    expect(atlanta.attributes.name).toMatch(/^atlanta/i);
    expect(barstow.attributes.name).toMatch(/^barstow/i);
    expect(chicago.attributes.name).toMatch(/^chicago/i);
    expect(detroit.attributes.name).toMatch(/^detroit/i);

    // Make sure all four show up in the list of Properties on the company
    const listResponse = await reactor.listPropertiesForCompany(
      helpers.companyId
    );
    const allIds = listResponse.data.map(resource => resource.id);
    expect(allIds).toContain(atlanta.id);
    expect(allIds).toContain(barstow.id);
    expect(allIds).toContain(chicago.id);
    expect(allIds).toContain(detroit.id);
    expect(allIds).toContain(newProperty.id);

    // Make sure you can get each one of the Properties
    await getPropertyByIdAndCheckName(atlanta.id, 'Atlanta');
    await getPropertyByIdAndCheckName(barstow.id, 'Barstow');
    await getPropertyByIdAndCheckName(chicago.id, 'Chicago');
    await getPropertyByIdAndCheckName(detroit.id, 'Detroit');

    // Test filtering Properties by name
    const filteredResponse = await reactor.listPropertiesForCompany(
      helpers.companyId,
      {
        'filter[name]': 'LIKE Detroit,LIKE Barstow'
      }
    );
    const twoIds = filteredResponse.data.map(resource => resource.id);
    expect(twoIds).not.toContain(atlanta.id);
    expect(twoIds).toContain(barstow.id);
    expect(twoIds).not.toContain(chicago.id);
    expect(twoIds).toContain(detroit.id);
    expect(twoIds).not.toContain(newProperty.id);
  });

  // Update a Property
  // https://developer.adobelaunch.com/api/properties/update/
  helpers.it('updates a Property', async function() {
    let response = await reactor.updateProperty({
      attributes: {
        name: newProperty.attributes.name.replace('NuProp', 'Updated NuProp'),
        domains: ['example.com']
      },
      id: newProperty.id,
      type: 'properties'
    });
    const updatedProperty = response.data;
    expect(updatedProperty.id).toBe(newProperty.id);
    expect(updatedProperty.attributes.domains).toEqual(['example.com']);

    response = await reactor.getProperty(newProperty.id);
    const oldProperty = response.data;
    expect(oldProperty.attributes.name).toMatch(/Updated NuProp/);
    expect(oldProperty.attributes.domains).toEqual(['example.com']);
  });
});
