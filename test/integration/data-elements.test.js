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

// DataElements
// https://developer.adobelaunch.com/api/data_elements
helpers.describe('DataElement API', function() {
  var theProperty;

  async function makeDataElement(baseName) {
    const de = await helpers.createTestDataElement(theProperty, baseName);
    return de;
  }

  beforeAll(async function setUpTestObjects() {
    theProperty = await helpers.createTestProperty('DataElement-Testing');
  });

  // Create a DataElement
  // https://developer.adobelaunch.com/api/data_elements/create/
  helpers.it('creates a new DataElement', async function() {
    await makeDataElement('create'); // all the expect()'s are in createTestDataElement
  });

  // Delete a DataElement
  // https://developer.adobelaunch.com/api/data_elements/delete/
  helpers.it('deletes a DataElement', async function() {
    const theDataElement = await makeDataElement('delete');

    const deleteResponse = await reactor.deleteDataElement(theDataElement.id);
    expect(deleteResponse).toBe(null);

    const response = await reactor.getDataElement(theDataElement.id);
    const deletedDE = response.data;
    expect(deletedDE.meta.deleted_at).toBeDefined();
  });

  // Get a DataElement
  // https://developer.adobelaunch.com/api/data_elements/fetch/
  helpers.it('gets a DataElement', async function() {
    const myName = 'extra special';
    const theDataElement = await makeDataElement(myName);

    const response = await reactor.getDataElement(theDataElement.id);
    expect(response.data.attributes.name).toMatch(myName);
  });

  // Get the Extension
  // https://developer.adobelaunch.com/api/data_elements/extension/
  helpers.it("gets a DataElement's Extension", async function() {
    const theDataElement = await makeDataElement('get_extension');
    const response = await reactor.getExtensionForDataElement(
      theDataElement.id
    );
    const coreExtensionId = await helpers.coreExtensionId(theProperty);
    expect(response.data.id).toBe(coreExtensionId);
  });

  // Get the Property
  // https://developer.adobelaunch.com/api/data_elements/property/
  helpers.it("gets a DataElement's Property", async function() {
    const theDataElement = await makeDataElement('get_property');
    const response = await reactor.getPropertyForDataElement(theDataElement.id);
    expect(response.data.id).toBe(theProperty.id);
  });

  // Get the origin
  // https://developer.adobelaunch.com/api/data_elements/origin/
  helpers.it("gets a DataElement's origin", async function() {
    // The origin of a newly-created DataElement is itself
    const theDataElement = await makeDataElement('get_origin');
    let response = await reactor.getOriginForDataElement(theDataElement.id);
    const origin0 = response.data;
    expect(origin0.id).toBe(theDataElement.id);
    expect(origin0.attributes.revision_number).toBe(0);

    // The origin of a revised DataElement is the original DataElement
    response = await reactor.reviseDataElement(theDataElement.id, {
      meta: { action: 'revise' }
    });
    const revision1 = response.data;
    expect(revision1.id).not.toBe(theDataElement.id);
    expect(revision1.id).toMatch(helpers.idDE);
    expect(revision1.attributes.revision_number).toBe(1);

    // The original DE is still has itself as origin, and is revision 0.
    response = await reactor.getOriginForDataElement(theDataElement.id);
    const origin0again = response.data;
    expect(origin0again.id).toBe(theDataElement.id);
    expect(origin0again.attributes.revision_number).toBe(0);
  });

  // List DataElements for a Property
  // https://developer.adobelaunch.com/api/data_elements/list/
  helpers.it('lists DataElements for a Property', async function() {
    // Create four DataElements
    const jamie = await makeDataElement('jamie_reagan');
    const danny = await makeDataElement('danny_reagan');
    const henry = await makeDataElement('henry_reagan');
    const eddie = await makeDataElement('eddie_janko');

    // Make sure all four show up in the list of DataElements on the company
    const listResponse = await reactor.listDataElementsForProperty(
      theProperty.id
    );
    const allIds = listResponse.data.map(resource => resource.id);
    expect(allIds).toContain(jamie.id);
    expect(allIds).toContain(danny.id);
    expect(allIds).toContain(henry.id);
    expect(allIds).toContain(eddie.id);

    // Test filtering DataElements by name
    const filteredResponse = await reactor.listDataElementsForProperty(
      theProperty.id,
      { 'filter[name]': 'LIKE y_reag' }
    );
    const twoIds = filteredResponse.data.map(resource => resource.id);
    expect(twoIds).not.toContain(jamie.id);
    expect(twoIds).toContain(danny.id);
    expect(twoIds).toContain(henry.id);
    expect(twoIds).not.toContain(eddie.id);
  });

  // List Libraries for a DataElement
  // https://developer.adobelaunch.com/api/data_elements/libraries/
  helpers.it("lists a DataElement's Libraries", async function() {
    const theDataElement = await makeDataElement('jesse_stone');
    const reviseResponse = await reactor.reviseDataElement(theDataElement.id, {
      meta: { action: 'revise' }
    });
    const jesse = reviseResponse.data;
    expect(jesse.id).not.toBe(theDataElement.id);
    expect(jesse.attributes.revision_number).toBe(1);

    async function linkToLibrary(libraryId) {
      const response = await reactor.addResourceRelationshipsToLibrary(
        libraryId,
        [{ id: jesse.id, type: 'data_elements' }]
      );
      const link = response.data;
      expect(link[0].id).toBe(jesse.id);
    }

    // Create four Libraries, and add the revised DataElement to all four.
    const pid = theProperty.id;
    const stone = await helpers.createTestLibrary(pid, 'Stone Cold');
    const night = await helpers.createTestLibrary(pid, 'Night Passage');
    const death = await helpers.createTestLibrary(pid, 'Death in Paradise');
    const doubt = await helpers.createTestLibrary(pid, 'Benefit of the Doubt');
    await linkToLibrary(stone.id);
    await linkToLibrary(night.id);
    await linkToLibrary(death.id);
    await linkToLibrary(doubt.id);

    // List all Libraries for the DataElement
    const listResponse = await reactor.listLibrariesForDataElement(jesse.id);
    const allIds = listResponse.data.map(library => library.id);
    expect(allIds).toContain(stone.id);
    expect(allIds).toContain(night.id);
    expect(allIds).toContain(death.id);
    expect(allIds).toContain(doubt.id);

    // List Libraries for the DataElement, with filter and sort
    // Filter: https://developer.adobelaunch.com/guides/api/filtering/
    // Sort:   https://developer.adobelaunch.com/guides/api/sorting/
    var filteredResponse = await reactor.listLibrariesForDataElement(jesse.id, {
      'filter[name]': 'LIKE P%(',
      sort: '-name'
    });
    const libraryNames = filteredResponse.data.map(lib => lib.attributes.name);
    expect(libraryNames.length).toBe(2);
    expect(libraryNames).toEqual([
      night.attributes.name,
      death.attributes.name
    ]);
  });

  // List revisions
  // https://developer.adobelaunch.com/api/data_elements/revisions/
  helpers.it('lists revisions of a DataElement', async function() {
    // This endpoint is tested below, at the end of the 'revises a DataElement'
    // test. It creates a DataElement and revises it twice.
    expect(null).toBeNull();
  });

  // Revise
  // https://developer.adobelaunch.com/api/data_elements/revise/
  helpers.it(
    'revises a DataElement',
    async function() {
      // The origin of a new DataElement is that DataElement itself
      const theDataElement = await makeDataElement('revise');
      expect(theDataElement.attributes.revision_number).toBe(0);
      let response = await reactor.getOriginForDataElement(theDataElement.id);
      const origin0 = response.data;
      expect(origin0.id).toBe(theDataElement.id);
      expect(origin0.attributes.revision_number).toBe(0);

      // Revise the DE. Produces a new DE whose origin is the original DE.
      response = await reactor.reviseDataElement(theDataElement.id, {
        meta: { action: 'revise' }
      });
      const revision1 = response.data;
      expect(revision1.id).not.toBe(theDataElement.id);
      expect(revision1.id).toMatch(helpers.idDE);
      expect(revision1.attributes.revision_number).toBe(1);
      response = await reactor.getOriginForDataElement(revision1.id);
      const origin1 = response.data;
      expect(origin1.id).toBe(theDataElement.id);
      expect(origin1.attributes.revision_number).toBe(0);

      // Update the DE...
      response = await reactor.updateDataElement({
        attributes: {
          name: theDataElement.attributes.name.replace('revise', 'revised')
        },
        id: theDataElement.id,
        type: 'data_elements'
      });
      const updatedDataElement = response.data;
      expect(updatedDataElement.id).toBe(theDataElement.id);
      expect(updatedDataElement.attributes.name).toMatch(/revised/);
      // ... and Revise again, ...
      response = await reactor.reviseDataElement(theDataElement.id, {
        meta: { action: 'revise' }
      });
      const revision2 = response.data;
      // ... which produces a new DE whose origin is the original DE.
      expect(revision2.id).not.toBe(theDataElement.id);
      expect(revision2.id).not.toBe(revision1.id);
      expect(revision2.id).toMatch(helpers.idDE);
      expect(revision2.attributes.revision_number).toBe(2);
      response = await reactor.getOriginForDataElement(revision2.id);
      const origin2 = response.data;
      expect(origin2.id).toBe(theDataElement.id);
      expect(origin1.attributes.revision_number).toBe(0);

      // The 1st revision still has as its origin the original DE.
      response = await reactor.getOriginForDataElement(revision1.id);
      const origin1again = response.data;
      expect(origin1again.id).toBe(theDataElement.id);
      expect(origin1again.attributes.revision_number).toBe(0);

      // The original DE is still has itself as origin and is revision 0.
      response = await reactor.getOriginForDataElement(theDataElement.id);
      const origin0again = response.data;
      expect(origin0again.id).toBe(theDataElement.id);
      expect(origin0again.attributes.revision_number).toBe(0);

      response = await reactor.listRevisionsForDataElement(theDataElement.id);
      const revisionIds = response.data.map(rev => rev.id);
      expect(revisionIds).toContain(theDataElement.id);
      expect(revisionIds).toContain(revision1.id);
      expect(revisionIds).toContain(revision2.id);
    }
    //30000
  );

  // Update a DataElement
  // https://developer.adobelaunch.com/api/data_elements/update/
  helpers.it(
    'updates a DataElement',
    async function() {
      const theDataElement = await makeDataElement('update');
      let response = await reactor.updateDataElement({
        attributes: {
          name: theDataElement.attributes.name.replace('update', 'updated')
        },
        id: theDataElement.id,
        type: 'data_elements'
      });
      const updatedDataElement = response.data;
      expect(updatedDataElement.id).toBe(theDataElement.id);
      expect(updatedDataElement.attributes.name).toMatch(/updated/);

      response = await reactor.getDataElement(theDataElement.id);
      const oldDataElement = response.data;
      expect(oldDataElement.attributes.name).toMatch(/updated/);
    }
    //30000
  );
});
