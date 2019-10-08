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

// Hosts
// https://developer.adobelaunch.com/api/hosts/
helpers.describe('Host API', function() {
  var theTestProperty;
  async function makeOrReuseTheTestProperty() {
    if (!theTestProperty) {
      theTestProperty = await helpers.createTestProperty('Host-Testing Base');
    }
    return theTestProperty;
  }

  async function newHost(hostName) {
    const theProperty = await makeOrReuseTheTestProperty();
    return await helpers.createTestSftpHost(theProperty.id, hostName);
  }

  // Create a Host
  // https://developer.adobelaunch.com/api/hosts/create/
  helpers.it('creates a new Host', async function() {
    const host = await newHost('Diamond');
    expect(host.id).toMatch(helpers.idHT);
  });

  // Delete a Host
  // https://developer.adobelaunch.com/api/hosts/delete/
  helpers.it('deletes a Host', async function() {
    const host = await newHost('Emerald');
    const deleteResponse = await reactor.deleteHost(host.id); //then delete
    expect(deleteResponse).toBe(null);
    try {
      await reactor.getHost(host.id);
      fail('getting a deleted host should fail');
    } catch (error) {
      expect(error.status).toBe(404);
    }
  });

  // Get a Host
  // https://developer.adobelaunch.com/api/hosts/fetch/
  helpers.it('gets a Host', async function() {
    const host = await newHost('Citrine');
    const response = await reactor.getHost(host.id);
    const found = response.data;
    expect(found.attributes.name).toMatch(/citrine/i);
  });

  // Get the Property
  // https://developer.adobelaunch.com/api/hosts/property/
  helpers.it("gets a Host's Property", async function() {
    const theProperty = await makeOrReuseTheTestProperty();
    const host = await newHost('Saphire');
    const response = await reactor.getPropertyForHost(host.id);
    expect(response.data.id).toBe(theProperty.id);
  });

  // List Hosts for a Property
  // https://developer.adobelaunch.com/api/hosts/list/
  helpers.it('lists all Hosts', async function() {
    const theProperty = await makeOrReuseTheTestProperty();
    const catseye = await newHost('Catseye');
    const apatite = await newHost('Apatite');
    const listResponse = await reactor.listHostsForProperty(theProperty.id);
    const allIds = listResponse.data.map(resource => resource.id);
    expect(allIds).toContain(catseye.id);
    expect(allIds).toContain(apatite.id);
  });

  // List Hosts for a Property, with filter and sort
  // List:   https://developer.adobelaunch.com/api/hosts/list/
  // Filter: https://developer.adobelaunch.com/guides/api/filtering/
  // Sort:   https://developer.adobelaunch.com/guides/api/sorting/
  helpers.it('lists filtered Hosts', async function() {
    const theProperty = await makeOrReuseTheTestProperty();
    const larimar = await newHost('Larimar');
    const peridot = await newHost('Peridot');
    const kunzite = await newHost('Kunzite');
    var filteredResponse = await reactor.listHostsForProperty(theProperty.id, {
      'filter[name]': 'CONTAINS erido,CONTAINS nzite',
      sort: '-name'
    });
    const hostNames = filteredResponse.data.map(
      resource => resource.attributes.name
    );
    expect(hostNames.length).toBe(2);
    expect(hostNames).toEqual([
      peridot.attributes.name,
      kunzite.attributes.name
    ]);
  });

  // Update a Host
  // https://developer.adobelaunch.com/api/hosts/update/
  helpers.it('updates a Host', async function() {
    const host = await newHost('Verdite');
    let response = await reactor.updateHost({
      attributes: {
        name: host.attributes.name.replace('Verdite', 'Verdite Updated'),
        username: 'John Hancock'
      },
      id: host.id,
      type: 'hosts'
    });
    const updatedHost = response.data;
    expect(updatedHost.id).toBe(host.id);
    expect(updatedHost.attributes.name).toMatch('Verdite Updated');
    expect(updatedHost.attributes.username).toEqual('John Hancock');

    response = await reactor.getHost(host.id);
    const oldHost = response.data;
    expect(oldHost.attributes.name).toMatch('Verdite Updated');
    expect(oldHost.attributes.username).toEqual('John Hancock');
  });
});
