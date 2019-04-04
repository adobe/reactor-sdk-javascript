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

// Callbacks
// https://developer.adobelaunch.com/api/callbacks

// Create a Callback
// https://developer.adobelaunch.com/api/callbacks/create/
export function createCallback(propertyId, callback) {
  return this.post(`/properties/${propertyId}/callbacks`, { data: callback });
}

// Delete a Callback
// https://developer.adobelaunch.com/api/callbacks/delete/
export function deleteCallback(callbackId) {
  return this.delete(`/callbacks/${callbackId}`);
}

// Get a Callback
// https://developer.adobelaunch.com/api/callbacks/fetch/
export function getCallback(callbackId) {
  return this.get(`/callbacks/${callbackId}`);
}

// Get the Property
// https://developer.adobelaunch.com/api/callbacks/property/
export function getPropertyForCallback(callbackId) {
  return this.get(`/callbacks/${callbackId}/property`);
}

// List Callbacks for a Property
// https://developer.adobelaunch.com/api/callbacks/list/
export function listCallbacksForProperty(propertyId, queryParams) {
  return this.get(`/properties/${propertyId}/callbacks`, queryParams);
}

// Update a Callback
// https://developer.adobelaunch.com/api/callbacks/update/
export function updateCallback(callbackPatch) {
  return this.patch(`/callbacks/${callbackPatch.id}`, { data: callbackPatch });
}
