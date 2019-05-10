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

// RuleComponents
// https://developer.adobelaunch.com/api/rule_components

// Create a RuleComponent
// https://developer.adobelaunch.com/api/rule_components/create/
export function deprecatedCreateRuleComponent(ruleId, ruleComponent) {
  return this.post(`/rules/${ruleId}/rule_components`, {
    data: ruleComponent
  });
}

// Create a RuleComponent
// https://developer.adobelaunch.com/api/reference/1.0/rule_components/create/
export function createRuleComponent(propertyId, ruleComponent) {
  return this.post(`/properties/${propertyId}/rule_components`, {
    data: ruleComponent
  });
}

//  Delete a RuleComponent
// https://developer.adobelaunch.com/api/rule_components/delete/
export function deleteRuleComponent(ruleComponentId) {
  return this.delete(`/rule_components/${ruleComponentId}`);
}

// Get a RuleComponent
// https://developer.adobelaunch.com/api/rule_components/fetch/
export function getRuleComponent(ruleComponentId) {
  return this.get(`/rule_components/${ruleComponentId}`);
}

// Get the Extension
// https://developer.adobelaunch.com/api/rule_components/extension/
export function getExtensionForRuleComponent(ruleComponentId) {
  return this.get(`/rule_components/${ruleComponentId}/extension`);
}

// List Rules for a RuleComponent
export function listRulesForRuleComponent(ruleComponentId) {
  return this.get(`/rule_components/${ruleComponentId}/rules`);
}

// List Rule relationships for a RuleComponent
export function listRuleRelationshipsForRuleComponent(ruleComponentId) {
  return this.get(`/rule_components/${ruleComponentId}/relationships/rule`);
}

// Get the origin
// https://developer.adobelaunch.com/api/rule_components/origin/
export function getOriginForRuleComponent(ruleComponentId) {
  return this.get(`/rule_components/${ruleComponentId}/origin`);
}

// List RuleComponents for a Rule
// https://developer.adobelaunch.com/api/rule_components/list/
export function listRuleComponentsForRule(ruleId, queryParams) {
  return this.get(`/rules/${ruleId}/rule_components`, queryParams);
}

// Update a RuleComponent
// https://developer.adobelaunch.com/api/rule_components/update/
export function updateRuleComponent(ruleComponentPatch) {
  return this.patch(`/rule_components/${ruleComponentPatch.id}`, {
    data: ruleComponentPatch
  });
}
