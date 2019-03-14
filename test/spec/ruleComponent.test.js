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

describe('RuleComponent:', function() {
  const context = jasmine.getEnv().reactorContext;
  const reactor = context.reactor;
  const ruleId = 'RL123';
  const ruleComponentId = 'RC123';

  describe('createRuleComponent', function() {
    it('runs an http POST', async function() {
      const ruleComponent = {
        attributes: {
          name: `RuleComponent ${new Date().getTime()}`
        },
        type: 'rule_components'
      };
      context.expectRequest(
        'post',
        `/rules/${ruleId}/rule_components`,
        ruleComponent
      );
      await reactor.createRuleComponent(ruleId, ruleComponent);
    });
  });

  describe('updateRuleComponent', function() {
    it('runs an http PATCH', async function() {
      const ruleComponentPatch = {
        id: ruleComponentId,
        attributes: {
          name: `Updated RuleCompoment ${new Date().getTime()}`
        },
        type: 'rule_components'
      };
      context.expectRequest(
        'patch',
        `/rule_components/${ruleComponentId}`,
        ruleComponentPatch
      );
      await reactor.updateRuleComponent(ruleComponentPatch);
    });
  });

  describe('getRuleComponent', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/rule_components/${ruleComponentId}`);
      await reactor.getRuleComponent(ruleComponentId);
    });
  });

  describe('listRuleComponentsForRule', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/rules/${ruleId}/rule_components`);
      await reactor.listRuleComponentsForRule(ruleId);
    });
    it('runs an http GET with query parameters', async function() {
      context.expectRequest(
        'get',
        `/rules/${ruleId}/rule_components?filter%5Bname%5D=EQ+Delta%2CEQ+Bravo&sort=-name`
      );
      await reactor.listRuleComponentsForRule(ruleId, {
        'filter[name]': 'EQ Delta,EQ Bravo',
        sort: '-name'
      });
    });
  });

  describe('deleteRuleComponent', function() {
    it('runs an http DELETE', async function() {
      context.expectRequest('delete', `/rule_components/${ruleComponentId}`);
      await reactor.deleteRuleComponent(ruleComponentId);
    });
  });
});
