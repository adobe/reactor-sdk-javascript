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

// Rules
// https://developer.adobelaunch.com/api/rules
//
// Create a Rule
// https://developer.adobelaunch.com/api/rules/create/
export function createRule(propertyId, rule) {
  return this.post(`/properties/${propertyId}/rules`, { data: rule });
}

// Delete a Rule
// https://developer.adobelaunch.com/api/rules/delete/
export function deleteRule(ruleId) {
  return this.delete(`/rules/${ruleId}`);
}

// Get a Rule
// https://developer.adobelaunch.com/api/rules/fetch/
export function getRule(ruleId) {
  return this.get(`/rules/${ruleId}`);
}

// Get the Property
// https://developer.adobelaunch.com/api/rules/property/
export function getPropertyForRule(ruleId) {
  return this.get(`/rules/${ruleId}/property`);
}

// List Libraries
// https://developer.adobelaunch.com/api/rules/libraries/
export function listLibrariesForRule(ruleId, queryParams) {
  return this.get(`/rules/${ruleId}/libraries`, queryParams);
}

// List Rules for Build
// https://developer.adobelaunch.com/api/builds/rules/
export function listRulesForBuild(buildId, queryParams) {
  return this.get(`/builds/${buildId}/rules`, queryParams);
}

// List Rules for Property
// https://developer.adobelaunch.com/api/rules/list/
export function listRulesForProperty(propertyId, queryParams) {
  return this.get(`/properties/${propertyId}/rules`, queryParams);
}

// List revisions
// https://developer.adobelaunch.com/api/rules/revisions/
export function listRevisionsForRule(ruleId) {
  return this.get(`/rules/${ruleId}/revisions`);
}

// Revise a Rule
// https://developer.adobelaunch.com/api/rules/revise/
export function reviseRule(ruleId) {
  return this.patch(`/rules/${ruleId}`, this.createReviseBody('rules', ruleId));
}

// Get origin for Rule
// https://developer.adobelaunch.com/api/rules/origin/
export function getOriginForRule(ruleId) {
  return this.get(`/rules/${ruleId}/origin`);
}

// Update a Rule
// https://developer.adobelaunch.com/api/rules/update/
export function updateRule(rulePatch) {
  return this.patch(`/rules/${rulePatch.id}`, {
    data: rulePatch
  });
}

// Create a note for Rule
// https://developer.adobelaunch.com/api/rules/:rule_id/notes
export function createNoteForRule(ruleId, note) {
  return this.post(`/rules/${ruleId}/notes`, {
    data: note
  });
}
