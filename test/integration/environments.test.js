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

// Environments
// https://developer.adobelaunch.com/api/environments
helpers.describe('Environment API', function() {
  var theProperty;
  var theHost;

  async function newTestEnvironment(environmentName) {
    const env = await helpers.createTestEnvironment(
      theProperty.id,
      environmentName,
      theHost.id
    );
    return env;
  }

  beforeAll(async function setUpTestObjects() {
    theProperty = await helpers.createTestProperty('Environment-Testing');
    const p = theProperty.id;
    theHost = await helpers.createTestSftpHost(p, 'Environment-Testing');
  });

  // Create an Environment
  // https://developer.adobelaunch.com/api/environments/create/
  helpers.it('creates a new Environment', async function() {
    const env = await newTestEnvironment('Emma');
    console.log('env:', env);
    expect(env.id).toMatch(helpers.idEN);
    expect(env.attributes.name).toMatch(/emma/i);
  });

  // Delete an Environment
  // https://developer.adobelaunch.com/api/environments/delete/
  helpers.it('deletes an Environment', async function() {
    const [p, a] = [theProperty.id, theHost.id];
    const nonce = await helpers.createTestEnvironment(p, 'Mayfly', a);
    expect(nonce.attributes.name).toMatch(/mayfly/i);

    const deleteResponse = await reactor.deleteEnvironment(nonce.id);
    expect(deleteResponse).toBe(null);

    try {
      await reactor.getEnvironment(nonce.id);
      fail('getting a deleted environment should fail');
    } catch (error) {
      expect(error.status).toBe(404);
    }
  });

  // Get an Environment
  // https://developer.adobelaunch.com/api/environments/fetch/
  helpers.it('gets an Environment', async function() {
    const env = await newTestEnvironment('Liam');
    const response = await reactor.getEnvironment(env.id);
    expect(response.data.attributes.name).toBe(env.attributes.name);
  });

  // Get the Host
  // https://developer.adobelaunch.com/api/environments/host/
  helpers.it("gets an Environment's Host", async function() {
    const env = await newTestEnvironment('Grady');
    const response = await reactor.getHostForEnvironment(env.id);
    expect(response.data).not.toBeUndefined();
    expect(response.data.id).toBe(env.associatedHostId);
    expect(response.data.type).toBe('hosts');
  });

  // Get the Host relationship
  // https://developer.adobelaunch.com/api/environments/host_relationship/
  helpers.it("gets an Environment's Host relationship", async function() {
    const env = await newTestEnvironment('Kyrie');
    const response = await reactor.getHostRelationshipForEnvironment(env.id);
    expect(response.data).not.toBeUndefined();
    expect(response.data.id).toBe(env.associatedHostId);
    expect(response.data.type).toBe('hosts');
    expect(response.data.attributes).toBeUndefined();
  });

  // Get the Library
  // https://developer.adobelaunch.com/api/environments/fetch_library/
  helpers.it("gets the Environment's Library", async function() {
    // create a library
    const createResponse = await reactor.createLibrary(theProperty.id, {
      attributes: { name: 'Olivia Get-Env Library' },
      type: 'libraries'
    });
    const lib = createResponse.data.id;
    expect(lib).toMatch(helpers.idLB);

    // set the library's environment to Olivia Env
    const environment = await newTestEnvironment('Olivia Get-Env Env');
    const env = environment.id;
    const rel = await reactor.setEnvironmentRelationshipForLibrary(lib, env);
    expect(rel.data.id).toBe(env);

    // test getLibraryForEnvironment
    var response = await reactor.getLibraryForEnvironment(env);
    expect(response.data).not.toBeUndefined();
    expect(response.data.id).toBe(lib);
    expect(response.data.attributes.name).toMatch(/olivia get-env library/i);
  });

  // Get the Property
  // https://developer.adobelaunch.com/api/environments/property/
  helpers.it("gets an Environment's Property", async function() {
    const env = await newTestEnvironment('Noah');
    const response = await reactor.getPropertyForEnvironment(env.id);
    expect(response.data).not.toBeUndefined();
    expect(response.data.id).toBe(theProperty.id);
    expect(response.data.type).toBe('properties');
    expect(response.data.attributes.name).toBe(theProperty.attributes.name);
  });

  // List Builds
  // https://developer.adobelaunch.com/api/environments/builds/
  helpers.it("lists an Environment's builds", async function() {
    // Create a library, host, environment
    const lib = await helpers.createTestLibrary(theProperty.id, 'Jack');
    const env = await helpers.makeLibraryEnvironment(lib, 'Jill', 'Akamai');
    await helpers.addCoreToLibrary(theProperty, lib);
    const buildId = await helpers.buildLibrary(lib);
    if (buildId === null) return;

    // test listBuildsForEnvironment
    const response = await reactor.listBuildsForEnvironment(env.id);
    const allIds = response.data.map(build => build.id);
    expect(allIds).toContain(buildId);
  });

  // List Environments for a Property
  // https://developer.adobelaunch.com/api/environments/list/
  helpers.it('lists all Environments', async function() {
    const logan = await newTestEnvironment('Logan');
    const mason = await newTestEnvironment('Mason');
    const james = await newTestEnvironment('James');
    const listResponse = await reactor.listEnvironmentsForProperty(
      theProperty.id
    );
    const allIds = listResponse.data.map(resource => resource.id);
    expect(allIds).toContain(logan.id);
    expect(allIds).toContain(mason.id);
    expect(allIds).toContain(james.id);
  });
  helpers.it('lists filtered Environments', async function() {
    const lucas = await newTestEnvironment('Lucas Alpha');
    const ethan = await newTestEnvironment('Ethan Bravo');
    const jacob = await newTestEnvironment('Jacob Alpha');
    var filteredResponse = await reactor.listEnvironmentsForProperty(
      theProperty.id,
      { 'filter[name]': 'CONTAINS alpha' }
    );
    const twoIds = filteredResponse.data.map(resource => resource.id);
    expect(twoIds).toContain(lucas.id);
    expect(twoIds).toContain(jacob.id);
    expect(twoIds).not.toContain(ethan.id);
  });

  // Update an Environment
  // https://developer.adobelaunch.com/api/environments/update/
  helpers.it('updates an Environment', async function() {
    const theEnvironment = await newTestEnvironment('Blick');
    let response = await reactor.updateEnvironment({
      attributes: {
        name: theEnvironment.attributes.name.replace('Blick', 'Blick Updated')
      },
      id: theEnvironment.id,
      type: 'environments'
    });
    const updatedEnvironment = response.data;
    expect(updatedEnvironment.id).toBe(theEnvironment.id);
    expect(updatedEnvironment.attributes.name).toMatch(/Updated/);

    response = await reactor.getEnvironment(theEnvironment.id);
    const freshlyLoaded = response.data;
    expect(freshlyLoaded.attributes.name).toMatch(/Updated/);
  });
});
