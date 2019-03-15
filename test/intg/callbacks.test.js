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

// Callbacks
// https://developer.adobelaunch.com/api/callbacks
describe('Callback API', function() {
  var theProperty;

  beforeAll(async function() {
    theProperty = await helpers.createTestProperty('Callback-Testing Base');
  });

  // Creates and returns a Callback associated with `theProperty`.
  async function createTestCallback(
    url = 'https://example.com/rule_change',
    watch = ['rule.created', 'rule.updated', 'rule.deleted']
  ) {
    const response = await reactor.createCallback(theProperty.id, {
      attributes: { url: url, subscriptions: watch }
    });
    expect(response)
      .withContext('creating test callback')
      .toBeDefined();
    expect(response.data)
      .withContext('creating test callback')
      .toBeDefined();
    const theCallback = response.data;
    expect(theCallback.id).toMatch(helpers.idCB);
    expect(theCallback.attributes.url).toBe(url);
    expect(theCallback.attributes.subscriptions).toEqual(watch);
    return theCallback;
  }

  // Create a Callback
  // https://developer.adobelaunch.com/api/callbacks/create/
  helpers.it('creates a new Callback', async function() {
    // all the expectations are in createTestCallback()
    const theCallback = await createTestCallback('https://example.com', [
      'rule.created',
      'data_element.created'
    ]);
  });

  // Delete a Callback
  // https://developer.adobelaunch.com/api/callbacks/delete/
  helpers.it('deletes a Callback', async function() {
    const theCallback = await createTestCallback('http://syzygy.com');

    const deleteResponse = await reactor.deleteCallback(theCallback.id);
    expect(deleteResponse).toBe(null);

    try {
      const deadCB = await reactor.getCallback(theCallback.id);
      fail('getting a deleted callback should fail');
    } catch (error) {
      expect(error.status).toBe(404);
    }
  });

  // Get a Callback
  // https://developer.adobelaunch.com/api/callbacks/fetch/
  helpers.it('gets a Callback', async function() {
    const myUrl = 'http://www.example.com/getter';
    const theCallback = await createTestCallback(myUrl);

    const response = await reactor.getCallback(theCallback.id);
    expect(response.data.attributes.url).toBe(myUrl);
  });

  // Get the Property
  // https://developer.adobelaunch.com/api/callbacks/property/
  helpers.it("gets a Callback's Property", async function() {
    const theCallback = await createTestCallback();
    const response = await reactor.getPropertyForCallback(theCallback.id);
    expect(response.data.id).toBe(theProperty.id);
  });

  // List Callbacks for a Property
  // https://developer.adobelaunch.com/api/callbacks/list/
  helpers.it('lists all Callbacks', async function() {
    // Create four Callbacks
    const eleanor = await createTestCallback('http://eleanor.com/');
    const chidi = await createTestCallback('http://chidi.com/');
    const tahani = await createTestCallback('http://tahani.com/');
    const jason = await createTestCallback('http://jason.com/');

    // Make sure all four show up in the list of Callbacks on the company
    const listResponse = await reactor.listCallbacksForProperty(theProperty.id);
    const allIds = listResponse.data.map(resource => resource.id);
    expect(allIds).toContain(eleanor.id);
    expect(allIds).toContain(chidi.id);
    expect(allIds).toContain(tahani.id);
    expect(allIds).toContain(jason.id);

    // There are no tests for a filtered list of callbacks, because Callbacks
    // have no filterable attributes.
  });

  // Update a Callback
  // https://developer.adobelaunch.com/api/callbacks/update/
  helpers.it('updates a Callback', async function() {
    const theCallback = await createTestCallback('https://michael.com', [
      'rule.created'
    ]);
    let response = await reactor.updateCallback({
      attributes: {
        url: 'https://eleanor.com',
        subscriptions: ['rule.deleted']
      },
      id: theCallback.id,
      type: 'callbacks'
    });
    const updatedCallback = response.data;
    expect(updatedCallback.id).toBe(theCallback.id);
    expect(updatedCallback.attributes.url).toEqual('https://eleanor.com');
    expect(updatedCallback.attributes.subscriptions).toEqual(['rule.deleted']);

    response = await reactor.getCallback(theCallback.id);
    const oldCallback = response.data;
    expect(oldCallback.attributes.url).toEqual('https://eleanor.com');
    expect(oldCallback.attributes.subscriptions).toEqual(['rule.deleted']);
  });
});
