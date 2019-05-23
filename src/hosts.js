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

// Hosts
// https://developer.adobelaunch.com/api/hosts/

// Create a Host
// https://developer.adobelaunch.com/api/hosts/create/
export function createHost(propertyId, hostSpec) {
  return this.post(`/properties/${propertyId}/hosts`, { data: hostSpec });
}

// Delete a Host
// https://developer.adobelaunch.com/api/hosts/delete/
export function deleteHost(hostId) {
  return this.delete(`/hosts/${hostId}`);
}

// Get a Host
// https://developer.adobelaunch.com/api/hosts/fetch/
export function getHost(hostId) {
  return this.get(`/hosts/${hostId}`);
}

// Get the Property for a Host
// https://developer.adobelaunch.com/api/hosts/property/
export function getPropertyForHost(hostId) {
  return this.get(`/hosts/${hostId}/property`);
}

// List Hosts for a Property
// https://developer.adobelaunch.com/api/hosts/list/
export function listHostsForProperty(propertyId, queryParams) {
  return this.get(`/properties/${propertyId}/hosts`, queryParams);
}

// Update a Host
// https://developer.adobelaunch.com/api/hosts/update/
export function updateHost(hostPatch) {
  return this.patch(`/hosts/${hostPatch.id}`, { data: hostPatch });
}
