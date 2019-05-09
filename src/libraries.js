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

// Libraries
// https://developer.adobelaunch.com/api/libraries

// Add DataElement relationships to a Library
// https://developer.adobelaunch.com/api/reference/1.0/libraries/relationships/data_elements/add_relationships/
// Example `deList` value:
//   [
//     { "DE0123456789012345678901", type: "data_elements"],
//     { "DE1234567890123456789012", type: "data_elements"],
//   ]
export function addDataElementRelationshipsToLibrary(libraryId, deList) {
  return this.post(`/libraries/${libraryId}/relationships/data_elements`, {
    data: deList
  });
}

// Add Extension relationships to a Library
// https://developer.adobelaunch.com/api/reference/1.0/libraries/relationships/extensions/add_relationships/
// Example `exList` value:
//   [
//     { "EX0123456789012345678901", type: "extensions"],
//     { "EX1234567890123456789012", type: "extensions"],
//   ]
export function addExtensionRelationshipsToLibrary(libraryId, exList) {
  return this.post(`/libraries/${libraryId}/relationships/extensions`, {
    data: exList
  });
}

// Add resources to a Library
// https://developer.adobelaunch.com/api/libraries/add_resources/
export function addResourceRelationshipsToLibrary(libraryId, postParams) {
  return this.post(`/libraries/${libraryId}/relationships/resources`, {
    data: postParams
  });
}

// Add Rule relationships to a Library
// https://developer.adobelaunch.com/api/reference/1.0/libraries/relationships/rules/add_relationships/
// Example `rlList` value:
//   [
//     { "RL0123456789012345678901", type: "rules"],
//     { "RL1234567890123456789012", type: "rules"],
//   ]
export function addRuleRelationshipsToLibrary(libraryId, rlList) {
  return this.post(`/libraries/${libraryId}/relationships/rules`, {
    data: rlList
  });
}

// Create a Library
// https://developer.adobelaunch.com/api/libraries/create/
export function createLibrary(propertyId, library) {
  return this.post(`/properties/${propertyId}/libraries`, {
    data: library
  });
}

// Delete a Library
export function deleteLibrary(libraryId) {
  return this.delete(`/libraries/${libraryId}`);
}

// Get the Environment
// https://developer.adobelaunch.com/api/libraries/fetch_environment/
export function getEnvironmentForLibrary(libraryId) {
  return this.get(`/libraries/${libraryId}/environment`);
}

// Get the Environment relationship
// https://developer.adobelaunch.com/api/libraries/fetch_environment_relationship/
export function getEnvironmentRelationshipForLibrary(libraryId) {
  return this.get(`/libraries/${libraryId}/relationships/environment`);
}

// Get a Library
// https://developer.adobelaunch.com/api/libraries/fetch/
export function getLibrary(libraryId) {
  return this.get(`/libraries/${libraryId}`);
}

// Get the Property
// https://developer.adobelaunch.com/api/libraries/property/
export function getPropertyForLibrary(libraryId) {
  return this.get(`/libraries/${libraryId}/property`);
}

// Get the upstream Library
// https://developer.adobelaunch.com/api/libraries/upstream/
export function getUpstreamLibraryForLibrary(libraryId) {
  return this.get(`/libraries/${libraryId}/upstream_library`);
}

// List DataElements
// https://developer.adobelaunch.com/api/reference/1.0/libraries/relationships/data_elements/list_related/
export function listDataElementsForLibrary(libraryId, queryParams) {
  return this.get(`/libraries/${libraryId}/data_elements`, queryParams);
}

// List DataElement relationships
// https://developer.adobelaunch.com/api/reference/1.0/libraries/relationships/data_elements/list_relationships/
export function listDataElementRelationshipsForLibrary(libraryId, queryParams) {
  return this.get(
    `/libraries/${libraryId}/relationships/data_elements`,
    queryParams
  );
}

// List Extensions
// https://developer.adobelaunch.com/api/reference/1.0/libraries/relationships/extensions/list_related/
export function listExtensionsForLibrary(libraryId, queryParams) {
  return this.get(`/libraries/${libraryId}/extensions`, queryParams);
}

// List Extension relationships
// https://developer.adobelaunch.com/api/reference/1.0/libraries/relationships/extensions/list_relationships/
export function listExtensionRelationshipsForLibrary(libraryId, queryParams) {
  return this.get(
    `/libraries/${libraryId}/relationships/extensions`,
    queryParams
  );
}

// List Libraries for a Property
// https://developer.adobelaunch.com/api/libraries/
export function listLibrariesForProperty(propertyId, queryParams) {
  return this.get(`/properties/${propertyId}/libraries`, queryParams);
}

// List resource relationships
// https://developer.adobelaunch.com/api/libraries/list_resource_relationships/
export function listResourceRelationshipsForLibrary(libraryId, queryParams) {
  return this.get(
    `/libraries/${libraryId}/relationships/resources`,
    queryParams
  );
}

// List resources
// https://developer.adobelaunch.com/api/libraries/resources/
export function listResourcesForLibrary(libraryId, queryParams) {
  return this.get(`/libraries/${libraryId}/resources`, queryParams);
}

// List Rule relationships
// https://developer.adobelaunch.com/api/reference/1.0/libraries/relationships/rules/list_relationships/
export function listRuleRelationshipsForLibrary(libraryId, queryParams) {
  return this.get(`/libraries/${libraryId}/relationships/rules`, queryParams);
}

// List Rules
// https://developer.adobelaunch.com/api/reference/1.0/libraries/relationships/rules/list_related/
export function listRulesForLibrary(libraryId, queryParams) {
  return this.get(`/libraries/${libraryId}/rules`, queryParams);
}

// Publish a Library
// https://developer.adobelaunch.com/api/libraries/publish/
export function publishLibrary(libraryId) {
  // NOTE: The Library's Environment must be of type Production, and the build
  // must succeed; otherwise, this will *not* generate a state transition to
  // 'published'.
  return this.createBuild(libraryId);
}

// Remove DataElement relationships
// https://developer.adobelaunch.com/api/reference/1.0/libraries/relationships/data_elements/remove_relationships/
// Example `deList` value:
//   [
//     { "DE0123456789012345678901", type: "data_elements"],
//     { "DE1234567890123456789012", type: "data_elements"],
//   ]
export function removeDataElementRelationshipsFromLibrary(libraryId, deList) {
  return this.delete(`/libraries/${libraryId}/relationships/data_elements`, {
    data: deList
  });
}

// Remove Extension relationships
// https://developer.adobelaunch.com/api/reference/1.0/libraries/relationships/extensions/remove_relationships/
// Example `exList` value:
//   [
//     { "EX0123456789012345678901", type: "extensions"],
//     { "EX1234567890123456789012", type: "extensions"],
//   ]
export function removeExtensionRelationshipsFromLibrary(libraryId, exList) {
  return this.delete(`/libraries/${libraryId}/relationships/extensions`, {
    data: exList
  });
}

// Remove Environment relationship
// https://developer.adobelaunch.com/api/libraries/delete_environment_relationship/
export function removeEnvironmentRelationshipFromLibrary(
  libraryId,
  environmentId
) {
  return this.delete(`/libraries/${libraryId}/relationships/environment`, {
    data: {
      id: environmentId,
      type: 'environments'
    },
    id: libraryId
  });
}

// Remove resource relationships
// https://developer.adobelaunch.com/api/libraries/remove_resource_relationships/
export function removeResourceRelationshipsFromLibrary(libraryId, resources) {
  return this.delete(`/libraries/${libraryId}/relationships/resources`, {
    data: resources
  });
}

// Remove Rule relationships
// https://developer.adobelaunch.com/api/reference/1.0/libraries/relationships/rules/remove_relationships/
// Example `rules` value:
//   [
//     { "RL0123456789012345678901", type: "rules"],
//     { "RL1234567890123456789012", type: "rules"],
//   ]
export function removeRuleRelationshipsFromLibrary(libraryId, rules) {
  return this.delete(`/libraries/${libraryId}/relationships/rules`, {
    data: rules
  });
}

// Replace Extension relationships
// https://developer.adobelaunch.com/api/reference/1.0/libraries/relationships/extensions/replace_relationships/
// Example `exList` value:
//   [
//     { "EX0123456789012345678901", type: "extensions"],
//     { "EX1234567890123456789012", type: "extensions"],
//   ]
export function replaceExtensionRelationshipsForLibrary(libraryId, exList) {
  return this.patch(`/libraries/${libraryId}/relationships/extensions`, {
    data: exList
  });
}

// Replace DataElement relationships
// https://developer.adobelaunch.com/api/reference/1.0/libraries/relationships/data_elements/replace_relationships/
// Example `deList` value:
//   [
//     { "DE0123456789012345678901", type: "data_elements"],
//     { "DE1234567890123456789012", type: "data_elements"],
//   ]
export function replaceDataElementRelationshipsForLibrary(libraryId, deList) {
  return this.patch(`/libraries/${libraryId}/relationships/data_elements`, {
    data: deList
  });
}

// Replace resource relationships
// https://developer.adobelaunch.com/api/libraries/replace_resource_relationships/
export function replaceResourceRelationshipsForLibrary(libraryId, resources) {
  return this.patch(`/libraries/${libraryId}/relationships/resources`, {
    data: resources
  });
}

// Replace Rule relationships
// https://developer.adobelaunch.com/api/reference/1.0/libraries/relationships/rules/replace_relationships/
// Example `rlList` value:
//   [
//     { "RL0123456789012345678901", type: "rules"],
//     { "RL1234567890123456789012", type: "rules"],
//   ]
export function replaceRuleRelationshipsForLibrary(libraryId, rlList) {
  return this.patch(`/libraries/${libraryId}/relationships/rules`, {
    data: rlList
  });
}

// Set Environment relationship for a Library
// https://developer.adobelaunch.com/api/libraries/set_environment_relationship/
export function setEnvironmentRelationshipForLibrary(libraryId, environmentId) {
  return this.patch(`/libraries/${libraryId}/relationships/environment`, {
    data: {
      id: environmentId,
      type: 'environments'
    },
    id: libraryId
  });
}

// Transition a Library
// https://developer.adobelaunch.com/api/libraries/transition/
// `action` must be 'submit', 'approve', 'reject', or 'develop'
export function transitionLibrary(libraryId, action) {
  return this.patch(`/libraries/${libraryId}`, {
    data: {
      id: libraryId,
      type: 'libraries',
      meta: {
        action
      }
    }
  });
}

// Update a Library
// https://developer.adobelaunch.com/api/libraries/update/
export function updateLibrary(libraryPatch) {
  return this.patch(`/libraries/${libraryPatch.id}`, {
    data: libraryPatch
  });
}
