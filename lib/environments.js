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

// Environments
// https://developer.adobelaunch.com/api/environments

// Create an Environment
// https://developer.adobelaunch.com/api/environments/create/
export function createEnvironment(propertyId, environment) {
  return this.post(`/properties/${propertyId}/environments`, {
    data: environment
  });
}

// Delete an Environment
// https://developer.adobelaunch.com/api/environments/delete/
export function deleteEnvironment(environmentId) {
  return this.delete(`/environments/${environmentId}`);
}

// Get an Environment
// https://developer.adobelaunch.com/api/environments/fetch/
export function getEnvironment(environmentId) {
  return this.get(`/environments/${environmentId}`);
}

// Get the Adapter
// https://developer.adobelaunch.com/api/environments/adapter/
export function getAdapterForEnvironment(environmentId) {
  return this.get(`/environments/${environmentId}/adapter`);
}

// Get the Adapter relationship
// https://developer.adobelaunch.com/api/environments/adapter_relationship/
export function getAdapterRelationshipForEnvironment(environmentId) {
  return this.get(`/environments/${environmentId}/relationships/adapter`);
}

// Get the Library
// https://developer.adobelaunch.com/api/environments/fetch_library/
export function getLibraryForEnvironment(environmentId) {
  return this.get(`/environments/${environmentId}/library`);
}

// Get the Property
// https://developer.adobelaunch.com/api/environments/property/
export function getPropertyForEnvironment(environmentId) {
  return this.get(`/environments/${environmentId}/property`);
}

// List Builds
// https://developer.adobelaunch.com/api/environments/builds/
export function listBuildsForEnvironment(propertyId, queryParams) {
  return this.get(`/properties/${propertyId}/builds`, queryParams);
}

// List Environments for a Property
// https://developer.adobelaunch.com/api/environments/list/
export function listEnvironmentsForProperty(propertyId, queryParams) {
  return this.get(`/properties/${propertyId}/environments`, queryParams);
}

// Update an Environment
// https://developer.adobelaunch.com/api/environments/update/
export function updateEnvironment(environmentPatch) {
  return this.patch(`/environments/${environmentPatch.id}`, {
    data: environmentPatch
  });
}
