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

// Rules
// https://developer.adobelaunch.com/api/rules
helpers.describe('Rule API', function() {
  var theProperty;

  async function makeTestRule(baseName) {
    const rule = await helpers.createTestRule(theProperty, baseName);
    expect(rule).toBeDefined();
    expect(rule.id).toMatch(helpers.idRL);
    expect(rule.attributes.name).toMatch(baseName);
    return rule;
  }

  async function makeRuleRevision(rule) {
    const reviseResponse = await reactor.reviseRule(rule.id);
    const revisedRule = reviseResponse.data;
    expect(revisedRule).toBeDefined();
    expect(revisedRule.id).toMatch(helpers.idRL);
    expect(revisedRule.id).not.toBe(rule.id);
    expect(revisedRule.attributes.name).toBe(rule.attributes.name);
    return revisedRule;
  }

  async function makeTestRuleAndRevision(baseName) {
    const rule = await makeTestRule(baseName);
    const revisedRule = await makeRuleRevision(rule);
    return [rule, revisedRule];
  }

  async function makeTestLibrary(baseName) {
    return await helpers.createTestLibrary(theProperty.id, baseName);
  }

  async function addRuleToLib(rule, lib) {
    const addResponse = await reactor.addResourceRelationshipsToLibrary(
      lib.id,
      [{ id: rule.id, type: 'rules' }]
    );
    const allIds = addResponse.data.map(resource => resource.id);
    expect(allIds).toContain(rule.id);
  }

  beforeAll(async function() {
    try {
      const base = 'Rule-Testing Base';
      theProperty = await helpers.createTestProperty(base);
    } catch (error) {
      helpers.reportError(error);
    }
  });

  // Some tests need a lot of supporting infrastructure. Since it is expensive
  // to set up, they share that infrastructure. It is stored in these variables,
  // which are initialized by initializeInfrastructure().

  // head Rules (named after Australian rivers)
  let [snowy, yango, wyong, tarra] = [];
  // Rule revisions
  let [snowy1, snowy2, yango1, wyong1, tarra1] = [];
  // Libraries (named after Australian states)
  let queensland; // contains the rule wyong1
  let victoria; // contains rules snowy1, wyong1, and yango1
  let tasmania; // contains no rules

  async function initializeSnowyRiver(revisionsNeeded) {
    if (!snowy) snowy = await makeTestRule('Snowy');
    if (revisionsNeeded > 0 && !snowy1) snowy1 = await makeRuleRevision(snowy);
    if (revisionsNeeded > 1 && !snowy2) snowy2 = await makeRuleRevision(snowy);
    expect(true).toBe(true); // prevent Jasmine "no expectations" error
  }

  async function initializeInfrastructure() {
    if (queensland) return;

    // Create Libraries
    queensland = await makeTestLibrary('Queensland'); // has one rule
    victoria = await makeTestLibrary('Victoria'); // has three rules
    tasmania = await makeTestLibrary('Tasmania'); // has no rules

    // Create Rules and Rule revisions
    await initializeSnowyRiver(2);
    [yango, yango1] = await makeTestRuleAndRevision('Yango');
    [wyong, wyong1] = await makeTestRuleAndRevision('Wyong');
    [tarra, tarra1] = await makeTestRuleAndRevision('Tarra');
    snowy2 = (await reactor.reviseRule(snowy.id)).data;

    // Add Rule revisions to Libraries
    await addRuleToLib(snowy1, victoria);
    await addRuleToLib(wyong1, victoria);
    await addRuleToLib(yango1, victoria);
    await addRuleToLib(wyong1, queensland);
  }

  // Give Victoria an Environment & Adapter, and return a build of the Library
  async function createVictoriaBuild() {
    await initializeInfrastructure();
    const [p, v] = [theProperty, victoria];
    const e = await helpers.createTestEnvironment(
      p.id,
      'SouthernCross',
      'Akamai'
    );
    const r = await reactor.setEnvironmentRelationshipForLibrary(v.id, e.id);
    expect(r.data.id).toBe(e.id);
    expect(r.links.related).toContain(`/${v.id}/`);
    return await helpers.buildLibrary(victoria);
  }

  // Create a Rule
  // https://developer.adobelaunch.com/api/rules/create/
  helpers.it('creates a new Rule', async function() {
    // all the expectations are in initializeSnowyRiver().
    await initializeSnowyRiver(0);
  });

  // Delete a Rule
  // https://developer.adobelaunch.com/api/rules/delete/
  helpers.it('deletes a Rule', async function() {
    const tooms = await makeTestRule('Tooms');
    const deleteResponse = await reactor.deleteRule(tooms.id);
    expect(deleteResponse).toBe(null);
    const deletedRule = await reactor.getRule(tooms.id);
    // Rules are soft-deleted
    // (i.e., marked as deleted, but not actually removed from the database).
    expect(deletedRule.data.meta.deleted_at).toBeDefined();
  });

  // Get a Rule
  // https://developer.adobelaunch.com/api/rules/fetch/
  helpers.it('gets a Rule', async function() {
    await initializeSnowyRiver(0);
    const gotten = await reactor.getRule(snowy.id);
    expect(gotten.data.id).toBe(snowy.id);
    expect(gotten.data.attributes.name).toMatch(/\bSnowy\b/i);
  });

  // Get a Rule's Property
  // https://developer.adobelaunch.com/api/rules/property/
  helpers.it("gets a Rule's Property", async function() {
    await initializeSnowyRiver(0);
    const response = await reactor.getPropertyForRule(snowy.id);
    expect(response.data.id).toBe(theProperty.id);
  });

  // List Libraries that use a Rule
  // https://developer.adobelaunch.com/api/rules/libraries/
  helpers.it("gets a Rule's Libraries", async function() {
    await initializeInfrastructure();
    // Wyong is in Queensland and Victoria, but not Tasmania
    const listResponse = await reactor.listLibrariesForRule(wyong1.id);
    const allIds = listResponse.data.map(resource => resource.id);
    expect(allIds).toContain(queensland.id);
    expect(allIds).toContain(victoria.id);
    expect(allIds).not.toContain(tasmania.id);
  });

  // List Rules for Build
  // https://developer.adobelaunch.com/api/builds/rules/
  helpers.it(
    'gets Rules for a Build',
    async function() {
      const buildId = await createVictoriaBuild();
      if (buildId == null) return;

      // Make sure three revised Rules are in the Rules on the Build
      let rules = await reactor.listRulesForBuild(buildId);
      let ids = rules.data.map(resource => resource.id);
      expect(ids).toContain(snowy1.id);
      expect(ids).toContain(wyong1.id);
      expect(ids).toContain(yango1.id);
      expect(ids).not.toContain(tarra1.id);

      // Test a name filter on listRulesForBuild
      rules = await reactor.listRulesForBuild(buildId, {
        'filter[name]': 'LIKE snowy,LIKE wyong'
      });
      ids = rules.data.map(resource => resource.id);
      expect(ids).toContain(snowy1.id);
      expect(ids).toContain(wyong1.id);
      expect(ids).not.toContain(yango1.id);
      expect(ids).not.toContain(tarra1.id);
    }
    //300000
  );

  // List Rules for Property
  // https://developer.adobelaunch.com/api/rules/list/
  helpers.it('gets Rules for the Property', async function() {
    await initializeInfrastructure();

    // Make sure all four unrevised rules are in Rules for the Property
    let rules = await reactor.listRulesForProperty(theProperty.id);
    let ids = rules.data.map(resource => resource.id);
    for (const r of [snowy, wyong, yango, tarra]) {
      expect(ids).toContain(r.id);
    }

    // Test a name filter on listRulesForProperty
    rules = await reactor.listRulesForProperty(theProperty.id, {
      'filter[name]': 'LIKE wyong,LIKE tarra'
    });
    ids = rules.data.map(resource => resource.id);
    expect(ids).toContain(wyong.id);
    expect(ids).toContain(tarra.id);
    expect(ids).not.toContain(snowy.id);
    expect(ids).not.toContain(yango.id);
  });

  // List revisions
  // https://developer.adobelaunch.com/api/rules/revisions/
  helpers.it("gets a Rule's revisions", async function() {
    await initializeSnowyRiver(2);
    const listResponse = await reactor.listRevisionsForRule(snowy.id);
    const ids = listResponse.data.map(x => x.id);
    expect(ids).toContain(snowy.id);
    expect(ids).toContain(snowy1.id);
    expect(ids).toContain(snowy2.id);
  });

  // Revise a Rule
  // https://developer.adobelaunch.com/api/rules/revise/
  helpers.it('revises a Rule', async function() {
    const paroo = await makeTestRule('Paroo');
    const reviseResponse = await reactor.reviseRule(paroo.id);
    const revisedRule = reviseResponse.data;
    expect(revisedRule).toBeDefined();
    expect(revisedRule.id).not.toBe(paroo.id);
    expect(revisedRule.attributes.name).toMatch(/\bParoo\b/i);
  });

  // Shows a Rule's Origin
  // https://developer.adobelaunch.com/api/rules/origin/
  helpers.it("gets a Rule's origin", async function() {
    await initializeSnowyRiver(2);
    const o0 = await reactor.getOriginForRule(snowy.id);
    const o1 = await reactor.getOriginForRule(snowy1.id);
    const o2 = await reactor.getOriginForRule(snowy2.id);
    for (const r of [o0, o1, o2]) {
      expect(r.data.id).toBe(snowy.id);
    }
  });

  // Update a Rule
  // https://developer.adobelaunch.com/api/rules/update/
  helpers.it('updates a Rule', async function() {
    const geery = await makeTestRule('Geery');
    let response = await reactor.updateRule({
      attributes: {
        name: geery.attributes.name.replace('Geery', 'Updated Geery')
      },
      id: geery.id,
      type: 'rules'
    });
    const updated = response.data;
    expect(updated.id).toBe(geery.id);

    response = await reactor.getRule(geery.id);
    const geeryCopy = response.data;
    expect(geeryCopy.attributes.name).toMatch(/Updated Geery/);
  });
});
