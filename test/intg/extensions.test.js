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

// Extensions
// https://developer.adobelaunch.com/api/extensions
describe('Extension API', function() {
  var theProperty;

  beforeAll(async function() {
    theProperty = await helpers.createTestProperty('Extension-Testing Base');
  });

  // Create an Extension
  // https://developer.adobelaunch.com/api/extensions/create/
  helpers.it('creates a new Extension', async function() {
    let analyticsEx = await helpers.findAnalyticsExtension(theProperty);
    if (analyticsEx) await helpers.killAnalyticsExtension(theProperty);
    analyticsEx = await helpers.makeAnalyticsExtension(theProperty);
    expect(analyticsEx.id).toMatch(helpers.idEX);
  });

  // Delete an Extension
  // https://developer.adobelaunch.com/api/extensions/delete/
  helpers.it('deletes an Extension', async function() {
    const analyticsEx = await helpers.analyticsExtension(theProperty);
    const deleteResponse = await reactor.deleteExtension(analyticsEx.id);
    delete theProperty.analyticsEx;
    expect(deleteResponse).toBeNull();
  });

  // Get an Extension
  // https://developer.adobelaunch.com/api/extensions/fetch/
  helpers.it('gets an Extension', async function() {
    const coreExId = await helpers.coreExtensionId(theProperty);
    const coreEx = (await reactor.getExtension(coreExId)).data;
    expect(coreEx).toBeDefined();
    expect(coreEx.id).toBe(coreExId);
  });

  // Get the ExtensionPackage
  // https://developer.adobelaunch.com/api/extensions/extension_package/
  helpers.it("gets an Extension's ExtensionPackage", async function() {
    const coreEpId = await helpers.coreExtensionPackageId();
    const coreExId = await helpers.coreExtensionId(theProperty);
    const getResponse = await reactor.getExtensionPackageForExtension(coreExId);
    const coreEp = getResponse.data;
    expect(coreEp).toBeDefined();
    expect(coreEp.id).toBe(coreEpId);
  });

  // Get the Property
  // https://developer.adobelaunch.com/api/extensions/property/
  helpers.it("gets an Extension's Property", async function() {
    const coreExId = await helpers.coreExtensionId(theProperty);
    const getPropertyResponse = await reactor.getPropertyForExtension(coreExId);
    const property = getPropertyResponse.data;
    expect(property.id).toBe(theProperty.id);
    expect(property.attributes.name).toMatch(/extension-testing base/i);
  });

  // List Extensions for a Property
  // https://developer.adobelaunch.com/api/extensions/list/
  helpers.it('lists all Extensions for a Property', async function() {
    const coreExId = await helpers.coreExtensionId(theProperty);
    const analyticsEx = await helpers.analyticsExtension(theProperty);
    const analyticsExId = analyticsEx.id;
    const response = await reactor.listExtensionsForProperty(theProperty.id);
    const allIds = response.data.map(resource => resource.id);
    expect(allIds).toContain(coreExId);
    expect(allIds).toContain(analyticsExId);
  });

  // List Libraries that use an Extension
  // https://developer.adobelaunch.com/api/extensions/libraries/
  helpers.it('lists all Libraries that use an Extension', async function() {
    const foo = await helpers.createTestLibrary(theProperty.id, 'Foo');
    const bar = await helpers.createTestLibrary(theProperty.id, 'Bar');
    await helpers.addCoreToLibrary(theProperty, foo);
    await helpers.addCoreToLibrary(theProperty, bar);
    const coreRevId = await helpers.coreExtensionRevisionId(theProperty);

    const libListResponse = await reactor.listLibrariesForExtension(coreRevId);
    const ids = libListResponse.data.map(lib => lib.id);
    expect(ids).toContain(foo.id);
    expect(ids).toContain(foo.id);
  });

  // List revisions of an Extension
  // https://developer.adobelaunch.com/api/extensions/revisions/
  helpers.it('lists all revisions of an Extension', async function() {
    const analyticsEx = await helpers.analyticsExtension(theProperty);
    const analyticsRev = (await reactor.reviseExtension(analyticsEx.id)).data;

    const response = await reactor.listRevisionsForExtension(analyticsEx.id);
    const allIds = response.data.map(resource => resource.id);
    expect(allIds).toContain(analyticsEx.id);
    expect(allIds).toContain(analyticsRev.id);
  });

  // Revise an Extension
  // https://developer.adobelaunch.com/api/extensions/revise/
  helpers.it('revises an Extension', async function() {
    let analyticsEx = await helpers.analyticsExtension(theProperty);
    await helpers.deleteAnalyticsExtension(theProperty);
    analyticsEx = await helpers.analyticsExtension(theProperty);
    const response = await reactor.reviseExtension(analyticsEx.id);
    const revision = response.data;
    expect(revision.id).toMatch(helpers.idEX);
    expect(revision.id).not.toBe(analyticsEx.id);
  });

  // Shows the origin of an Extension
  // https://developer.adobelaunch.com/api/extensions/origin/
  helpers.it('shows the origin of an Extension', async function() {
    const analyticsEx = await helpers.analyticsExtension(theProperty);
    const analyticsRev = (await reactor.reviseExtension(analyticsEx.id)).data;

    const origin = (await reactor.getOriginForExtension(analyticsRev.id)).data;
    expect(origin.id).toBe(analyticsEx.id);
    expect(origin.attributes.revision_number).toBe(0);
  });
});
