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

// Libraries
// https://developer.adobelaunch.com/api/libraries
helpers.describe('Library API', function() {
  var theProperty;
  var libAaron;
  var libBrian;
  var libChuck;

  beforeAll(async function() {
    try {
      theProperty = await helpers.createTestProperty('Library-Testing Base');
      libAaron = await helpers.createTestLibrary(theProperty.id, 'Aaron');
      libBrian = await helpers.createTestLibrary(theProperty.id, 'Brian');
      libChuck = await helpers.createTestLibrary(theProperty.id, 'Chuck');
    } catch (error) {
      helpers.specName = 'Library beforeAll';
      helpers.reportError(error);
    }
  });

  // Add resource relationships to a Library
  // https://developer.adobelaunch.com/api/libraries/add_resources/
  helpers.it('adds resource relationships to a Library', async function() {
    // All the expectations are in makeResourcesAndAddToLibrary().
    await makeResourcesAndAddToLibrary(theProperty, libAaron, ['ann', 'bob']);
  });

  // Create a Library
  // https://developer.adobelaunch.com/api/libraries/create/
  helpers.it('creates a new Library', function() {
    // Three libraries should have been created in beforeAll().
    expect(libAaron.id).toMatch(helpers.idLB);
    expect(libBrian.id).toMatch(helpers.idLB);
    expect(libChuck.id).toMatch(helpers.idLB);
  });

  // Get a Library
  // https://developer.adobelaunch.com/api/libraries/fetch/
  helpers.it('gets a Library', async function() {
    const response = await reactor.getLibrary(libBrian.id);
    const brian = response.data;
    expect(brian.attributes.name).toMatch(/brian/i);
  });

  // Get the Environment
  // https://developer.adobelaunch.com/api/libraries/fetch_environment/
  helpers.it("gets a Library's Environment", async function() {
    const env = await helpers.makeLibraryEnvironment(libAaron, 'David');

    // test getEnvironmentForLibrary
    var response = await reactor.getEnvironmentForLibrary(libAaron.id);
    expect(response.data).not.toBeUndefined();
    expect(response.data.id).toBe(env.id);
    // check that we got a resource, not a relationship
    expect(response.data.attributes.name).toMatch(/david/i);
  });

  // Get the Environment relationship
  // https://developer.adobelaunch.com/api/libraries/fetch_environment_relationship/
  helpers.it("gets a Library's Environment relationship", async function() {
    const env = await helpers.makeLibraryEnvironment(libBrian, 'Ethan');

    // test getEnvironmentRelationshipForLibrary
    var response = await reactor.getEnvironmentRelationshipForLibrary(
      libBrian.id
    );
    expect(response.data).not.toBeUndefined();
    expect(response.data.id).toBe(env.id);
    // Check that we got a relationship, not a resource
    expect(response.data.attributes).not.toBeDefined();
    expect(response.data.type).toBe('environments');
  });

  // Get the Property
  // https://developer.adobelaunch.com/api/libraries/property/
  helpers.it("gets a Library's Property", async function() {
    const response = await reactor.getPropertyForLibrary(libChuck.id);
    expect(response.data.id).toBe(theProperty.id);
    expect(response.data.attributes.name).toMatch(/Library-Testing.*Property/i);
  });

  // Get the upstream Library
  // https://developer.adobelaunch.com/api/libraries/fetch_upstream/
  helpers.it("gets a Library's upstream Library", async function() {
    const lib = libAaron;
    const upstreamResponse = await reactor.getUpstreamLibraryForLibrary(lib.id);
    expect(upstreamResponse.data).toBeNull();
    //TODO: transition the library a couple of times and THEN test upstreams
  });

  // List Libraries for a Property
  // https://developer.adobelaunch.com/api/libraries/list/
  helpers.it('lists all Libraries for a Property', async function() {
    // Make sure all three libraries show up in the list of Libraries on Property
    const listResponse = await reactor.listLibrariesForProperty(theProperty.id);
    const allIds = listResponse.data.map(resource => resource.id);
    expect(allIds).toContain(libAaron.id);
    expect(allIds).toContain(libBrian.id);
    expect(allIds).toContain(libChuck.id);
  });

  helpers.it('lists filtered Libraries for a Property', async function() {
    var filteredResponse = await reactor.listLibrariesForProperty(
      theProperty.id,
      { 'filter[name]': 'LIKE aro,LIKE ria' }
    );
    const twoIds = filteredResponse.data.map(resource => resource.id);
    expect(twoIds).toContain(libAaron.id);
    expect(twoIds).toContain(libBrian.id);
    expect(twoIds).not.toContain(libChuck.id);
  });

  // List resource relationships
  // https://developer.adobelaunch.com/api/libraries/list_resource_relationships/
  helpers.it("lists a Library's resource relationships", async function() {
    // All the expectations are in makeResourcesAndAddToLibrary().
    await makeResourcesAndAddToLibrary(theProperty, libBrian, ['cyd', 'don']);
  });

  // List resources
  // https://developer.adobelaunch.com/api/libraries/resources/
  helpers.it("lists a Library's resources", async function() {
    const names = ['eve', 'flo', 'gus'];
    const dataElements = await makeResourcesAndAddToLibrary(
      theProperty,
      libChuck,
      names
    );

    const listResponse = await reactor.listResourcesForLibrary(libChuck.id);
    const allIds = listResponse.data.map(r => r.id);
    const allNames = listResponse.data.map(r => r.attributes.name);
    for (const de of dataElements) {
      expect(allIds).toContain(de.id);
      // Check that these are resources, not just resource relationships. The
      // relationship will not have an `attributes` field, but the resource will.
      // And `attributes` will have a `name` (among other values).
      expect(allNames).toContain(de.attributes.name);
    }
  });

  // Publish a Library
  // https://developer.adobelaunch.com/api/libraries/publish/
  helpers.it('publishes a Library', async function() {
    const aProperty = await helpers.createTestProperty('Publishing Base');
    let lib = await helpers.createTestLibrary(aProperty.id, 'Hyrum');
    await helpers.addCoreToLibrary(aProperty, lib);
    await makeResourcesAndAddToLibrary(aProperty, lib, ['ian']);
    await helpers.makeLibraryEnvironment(lib, 'Hyrum dev env', 'Akamai');

    await helpers.buildLibrary(lib);
    await helpers.transitionLibrary(lib, 'submit');

    await helpers.makeLibraryEnvironment(lib, 'Hyrum stage env', 'Akamai');
    await helpers.buildLibrary(lib);
    await helpers.transitionLibrary(lib, 'approve');

    await helpers.makeLibraryEnvironment(lib, 'Hyrum prod env', 'Akamai');
    await helpers.buildLibrary(lib);
    // transition to 'published' is automatic

    lib = await reactor.getLibrary(lib.id);
    expect(lib.data.attributes.state).toBe('published');
  });

  // Remove Environment relationship
  // https://developer.adobelaunch.com/api/libraries/delete_environment_relationship/
  helpers.it("removes a Library's Environment relationship", async function() {
    const env = await helpers.makeLibraryEnvironment(libAaron, 'Felix');

    // test removeEnvironmentRelationshipFromLibrary
    var response = await reactor.removeEnvironmentRelationshipFromLibrary(
      libAaron.id,
      env.id
    );
    expect(response).toBeNull(); // and no error was thrown
  });

  // Remove resources
  // https://developer.adobelaunch.com/api/libraries/remove_resource_relationships/
  helpers.it("removes a Library's resources", async function() {
    const names = ['ian', 'jan', 'kip'];
    const [ian, jan, kip] = await makeResourcesAndAddToLibrary(
      theProperty,
      libAaron,
      names
    );

    const response = await reactor.removeResourceRelationshipsFromLibrary(
      libAaron.id,
      [
        { id: ian.id, type: 'data_elements' },
        { id: kip.id, type: 'data_elements' }
      ]
    );

    const listResponse = await reactor.listResourceRelationshipsForLibrary(
      libAaron.id
    );
    const listedIds = listResponse.data.map(resource => resource.id);
    expect(listedIds).not.toContain(ian.id);
    expect(listedIds).toContain(jan.id);
    expect(listedIds).not.toContain(kip.id);
  });

  // Replace resources
  // https://developer.adobelaunch.com/api/libraries/replace_resource_relationships/
  helpers.it("replaces a Library's resources", async function() {
    const [liz, mac, nan] = await makeResourcesAndAddToLibrary(
      theProperty,
      libAaron,
      ['liz', 'mac', 'nan']
    );
    const [ole, pam] = await makeResources(theProperty, ['ole', 'pam']);

    const id = libAaron.id;
    const response = await reactor.replaceResourceRelationshipsForLibrary(id, [
      { id: ole.id, type: 'data_elements' },
      { id: pam.id, type: 'data_elements' }
    ]);

    const listResponse = await reactor.listResourceRelationshipsForLibrary(id);
    const listedIds = listResponse.data.map(resource => resource.id);
    expect(listedIds).not.toContain(liz.id);
    expect(listedIds).not.toContain(mac.id);
    expect(listedIds).not.toContain(nan.id);
    expect(listedIds).toContain(ole.id);
    expect(listedIds).toContain(pam.id);
  });

  // Set Environment relationship for a Library
  // https://developer.adobelaunch.com/api/libraries/add_environment/
  helpers.it('sets Environment relationship for a Library', async function() {
    await helpers.makeLibraryEnvironment(libAaron);
  });

  // Transition a Library
  // https://developer.adobelaunch.com/api/libraries/transition/
  helpers.it('transitions a Library', async function() {
    const aProperty = await helpers.createTestProperty(
      'Library Transition-Testing Base'
    );
    const lib = await helpers.createTestLibrary(aProperty.id, 'Irwin');
    await helpers.makeLibraryEnvironment(lib, 'Irwin dev env', 'Akamai');
    await helpers.addCoreToLibrary(aProperty, lib);
    await helpers.buildLibrary(lib);

    // transition
    const response = await reactor.transitionLibrary(lib.id, 'submit');
    expect(response.data.attributes.state).toBe('submitted');
  });

  // Update a Library
  // https://developer.adobelaunch.com/api/libraries/update/
  helpers.it('updates a Library', async function() {
    const updateResponse = await reactor.updateLibrary({
      attributes: { name: 'Chuck Updated' },
      id: libChuck.id,
      type: 'libraries'
    });
    expect(updateResponse.data.id).toBe(libChuck.id);
    expect(updateResponse.data.attributes.name).toMatch(/chuck updated/i);

    const getResponse = await reactor.getLibrary(libChuck.id);
    expect(getResponse.data.attributes.name).toMatch(/chuck updated/i);
  });

  // Make a DataElement with each name, revise each, and return a list
  // containing the revised DataElements.
  async function makeResources(targetProperty, names) {
    // Create a DataElement for each name
    const heads = await Promise.all(
      names.map(name => helpers.createTestDataElement(targetProperty, name))
    );

    // Revise each DataElement
    const revisions = await Promise.all(
      heads.map(async function(head) {
        const action = { meta: { action: 'revise' } };
        const reviseResponse = await reactor.reviseDataElement(head.id, action);
        const revised = reviseResponse.data;
        expect(revised.id).not.toBe(head.id);
        expect(revised.id).toMatch(helpers.idDE);
        expect(revised.attributes.revision_number).toBe(1);
        return revised;
      })
    );
    return revisions;
  }

  // Make a DataElement with each name, revise each, and add the revisions to
  // lib.  Return a list containing the revised DataElements.
  async function makeResourcesAndAddToLibrary(
    prop,
    lib,
    names = ['ann', 'bob']
  ) {
    // Get new (and revised) DataElements
    const revisions = await makeResources(prop, names);

    // Add all the revised DataElements to lib
    const revisionIds = revisions.map(resource => resource.id);
    const addResponse = await reactor.addResourceRelationshipsToLibrary(
      lib.id,
      revisionIds.map(id => ({ id: id, type: 'data_elements' }))
    );
    const addedIds = addResponse.data.map(resource => resource.id).sort();
    for (const id of revisionIds) {
      expect(addedIds).toContain(id);
    }

    // Check whether they all show up when resources are listed
    const listResponse = await reactor.listResourceRelationshipsForLibrary(
      lib.id
    );
    const listedIds = listResponse.data.map(resource => resource.id);
    for (const id of revisionIds) {
      expect(listedIds).toContain(id);
    }

    return revisions;
  }
});
