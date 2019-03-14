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

// RuleComponents
// https://developer.adobelaunch.com/api/rule_components
describe('RuleComponent API', function() {
  var theProperty;
  var theRule;

  async function makeTestRC(baseName, order) {
    return await helpers.createTestRuleComponent(
      theProperty,
      theRule,
      baseName,
      order
    );
  }

  beforeAll(async function() {
    try {
      const base = 'RuleComponent-Testing Base';
      theProperty = await helpers.createTestProperty(base);
      theRule = await helpers.createTestRule(theProperty, base);
    } catch (error) {
      helpers.reportError(error);
    }
  });

  afterAll(async function() {
    await reactor.deleteProperty(theProperty.id);
    theProperty = null;
  });

  // Create a RuleComponent
  // https://developer.adobelaunch.com/api/rule_components/create/
  helpers.it('creates a new RuleComponent', async function() {
    // all the expectations are in createTestRuleComponent
    const rcOrem = await makeTestRC('Orem', 1);
  });

  // Delete a RuleComponent
  // https://developer.adobelaunch.com/api/rule_components/delete/
  helpers.it('deletes a RuleComponent', async function() {
    const rcLehi = await makeTestRC('Lehi', 1);
    const deleteResponse = await reactor.deleteRuleComponent(rcLehi.id);
    expect(deleteResponse).toBe(null);

    try {
      const deadRC = await reactor.getRuleComponent(rcLehi.id);
      fail('getting a deleted rule_component should fail');
    } catch (error) {
      expect(error.status).toBe(404);
    }
  });

  // Get a RuleComponent
  // https://developer.adobelaunch.com/api/rule_components/fetch/
  helpers.it('gets a RuleComponent', async function() {
    const rcTemp = await makeTestRC('Mona', 2);
    const rcMona = await reactor.getRuleComponent(rcTemp.id);
    expect(rcMona.data.id).toBe(rcTemp.id);
    expect(rcMona.data.attributes.name).toMatch(/\bMona\b/i);
  });

  // Get a RuleComponent's Extension
  // https://developer.adobelaunch.com/api/rule_components/extension/
  helpers.it("gets a RuleComponent's Extension", async function() {
    const rcAlta = await makeTestRC('Alta', 3);
    const response = await reactor.getExtensionForRuleComponent(rcAlta.id);
    expect(response.data.id).toBe(await helpers.coreExtensionId(theProperty));
  });

  // Get a RuleComponent's Rule
  // https://developer.adobelaunch.com/api/rule_components/rule/
  helpers.it("gets a RuleComponent's Rule", async function() {
    const rcHyrum = await makeTestRC('Hyrum', 9);
    const response = await reactor.getRuleForRuleComponent(rcHyrum.id);
    expect(response.data.id).toBe(theRule.id);
  });

  // Get a RuleComponent's origin
  // https://developer.adobelaunch.com/api/rule_components/origin/
  helpers.it("gets a RuleComponent's origin", async function() {
    const rcPerry = await makeTestRC('Perry', 10);
    const response = await reactor.getOriginForRuleComponent(rcPerry.id);
    expect(response.data.id).toBe(rcPerry.id);
  });

  // List RuleComponents for a Rule
  // https://developer.adobelaunch.com/api/rule_components/list/
  helpers.it('lists all RuleComponents', async function() {
    // Create three RuleComponents
    const rcKamas = await makeTestRC('Kamas', 4);
    const rcMagna = await makeTestRC('Magna', 5);
    const rcSandy = await makeTestRC('Sandy', 6);

    // Make sure all three show up in the list of RuleComponents on the Rule
    const listResponse = await reactor.listRuleComponentsForRule(theRule.id);
    const allIds = listResponse.data.map(resource => resource.id);
    expect(allIds).toContain(rcKamas.id);
    expect(allIds).toContain(rcMagna.id);
    expect(allIds).toContain(rcSandy.id);

    // Test a name filter
    var filteredResponse = await reactor.listRuleComponentsForRule(theRule.id, {
      'filter[name]': 'LIKE amas,LIKE andy'
    });
    const twoIds = filteredResponse.data.map(resource => resource.id);
    expect(twoIds).toContain(rcKamas.id);
    expect(twoIds).not.toContain(rcMagna.id);
    expect(twoIds).toContain(rcSandy.id);
  });

  // Update a RuleComponent
  // https://developer.adobelaunch.com/api/rule_components/update/
  helpers.it('updates a RuleComponent', async function() {
    const rcOphir = await makeTestRC('Ophir', 7);
    let response = await reactor.updateRuleComponent({
      attributes: {
        name: rcOphir.attributes.name.replace('Ophir', 'Updated Ophir'),
        order: 8
      },
      id: rcOphir.id,
      type: 'rule_components'
    });
    const rcUpdated = response.data;
    expect(rcUpdated.id).toBe(rcOphir.id);
    expect(rcUpdated.attributes.order).toEqual(8);

    response = await reactor.getRuleComponent(rcOphir.id);
    const oldRC = response.data;
    expect(oldRC.attributes.name).toMatch(/Updated Ophir/);
    expect(oldRC.attributes.order).toEqual(8);
  });
});
