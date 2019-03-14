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

// Add resources to a Library
// https://developer.adobelaunch.com/api/libraries/add_resources/
export function addResourceRelationshipsToLibrary(libraryId, postParams) {
  return this.post(`/libraries/${libraryId}/relationships/resources`, {
    data: postParams
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

// Get a Library
// https://developer.adobelaunch.com/api/libraries/fetch/
export function getLibrary(libraryId) {
  return this.get(`/libraries/${libraryId}`);
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

// List Libraries for a Property
// https://developer.adobelaunch.com/api/libraries/list/
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

// Publish a Library
// https://developer.adobelaunch.com/api/libraries/publish/
export function publishLibrary(libraryId) {
  return this.post(`/libraries/${libraryId}/builds`);
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

// Replace resource relationships
// https://developer.adobelaunch.com/api/libraries/replace_resource_relationships/
export function replaceResourceRelationshipsForLibrary(libraryId, resources) {
  return this.patch(`/libraries/${libraryId}/relationships/resources`, {
    data: resources
  });
}
// Set Environment relationship for a Library
// https://developer.adobelaunch.com/api/libraries/set_environment_relationship/
export function setEnvironmentRelationshipForLibrary(libraryId, environmentId) {
  checkLibraryId(libraryId);
  checkEnvironmentId(environmentId);
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

function checkLibraryId(id) {
  if (!/^LB[0-9a-f]{32}$/.test(id)) throw `bad Library ID: ${id}`;
}
function checkEnvironmentId(id) {
  if (!/^EN[0-9a-f]{32}$/.test(id)) throw `bad Environment ID: ${id}`;
}
