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

// Adapters
// https://developer.adobelaunch.com/api/adapters/

// Create an Adapter
// https://developer.adobelaunch.com/api/adapters/create/
export function createAdapter(propertyId, adapterSpec) {
  return this.post(`/properties/${propertyId}/adapters`, { data: adapterSpec });
}

// Delete an Adapter
// https://developer.adobelaunch.com/api/adapters/delete/
export function deleteAdapter(adapterId) {
  return this.delete(`/adapters/${adapterId}`);
}

// Get an Adapter
// https://developer.adobelaunch.com/api/adapters/fetch/
export function getAdapter(adapterId) {
  return this.get(`/adapters/${adapterId}`);
}

// Get the Property for an Adapter
// https://developer.adobelaunch.com/api/adapters/property/
export function getPropertyForAdapter(adapterId) {
  return this.get(`/adapters/${adapterId}/property`);
}

// List Adapters for a Property
// https://developer.adobelaunch.com/api/adapters/list/
export function listAdaptersForProperty(propertyId, queryParams) {
  return this.get(`/properties/${propertyId}/adapters`, queryParams);
}

// Update an Adapter
// https://developer.adobelaunch.com/api/adapters/update/
export function updateAdapter(adapterPatch) {
  return this.patch(`/adapters/${adapterPatch.id}`, { data: adapterPatch });
}
