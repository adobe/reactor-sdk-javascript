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

import { createReviseBody } from '../../';

describe('Rule:', function() {
  const context = jasmine.getEnv().reactorContext;
  const reactor = context.reactor;
  const propertyId = 'PR123';
  const ruleId = 'RL123';

  describe('createRule', function() {
    it('runs an http POST', async function() {
      const rule = {
        attributes: {
          name: `Rule ${new Date().getTime()}`
        },
        type: 'rules'
      };
      context.expectRequest('post', `/properties/${propertyId}/rules`, rule);
      await reactor.createRule(propertyId, rule);
    });
  });

  describe('updateRule', function() {
    it('runs an http PATCH', async function() {
      const rulePatch = {
        id: ruleId,
        attributes: {
          name: `Updated Rule ${new Date().getTime()}`
        },
        type: 'rules'
      };
      context.expectRequest('patch', `/rules/${ruleId}`, rulePatch);
      await reactor.updateRule(rulePatch);
    });
  });

  describe('reviseRule', function() {
    it('runs an http PATCH', async function() {
      const reviseBody = createReviseBody('rules', ruleId);
      context.expectRequest('patch', `/rules/${ruleId}`, reviseBody);
      await reactor.reviseRule(ruleId);
    });
  });

  describe('listRevisionsForRule', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/rules/${ruleId}/revisions`);
      await reactor.listRevisionsForRule(ruleId);
    });
  });

  describe('getRule', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/rules/${ruleId}`);
      await reactor.getRule(ruleId);
    });
  });

  describe('listRulesForProperty', function() {
    it('runs an http GET', async function() {
      context.expectRequest('get', `/properties/${propertyId}/rules`);
      await reactor.listRulesForProperty(propertyId);
    });
    it('runs an http GET with query parameters', async function() {
      context.expectRequest(
        'get',
        `/properties/${propertyId}/rules?filter%5Bname%5D=EQ+Delta%2CEQ+Bravo&sort=-name`
      );
      await reactor.listRulesForProperty(propertyId, {
        'filter[name]': 'EQ Delta,EQ Bravo',
        sort: '-name'
      });
    });
  });

  describe('deleteRule', function() {
    it('runs an http DELETE', async function() {
      context.expectRequest('delete', `/rules/${ruleId}`);
      await reactor.deleteRule(ruleId);
    });
  });
});
