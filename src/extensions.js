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

// Extensions
// https://developer.adobelaunch.com/api/reference/1.0/extensions/

// Create Extension
// https://developer.adobelaunch.com/api/reference/1.0/extensions/create/
export function createExtension(propertyId, extension) {
  return this.post(`/properties/${propertyId}/extensions`, {
    data: extension
  });
}

// Delete Extension
// https://developer.adobelaunch.com/api/reference/1.0/extensions/delete/
export function deleteExtension(extensionId) {
  return this.delete(`/extensions/${extensionId}`);
}

// Get Extension
// https://developer.adobelaunch.com/api/reference/1.0/extensions/fetch/
export function getExtension(extensionId) {
  return this.get(`/extensions/${extensionId}`);
}

// Get Extension's ExtensionPackage
// https://developer.adobelaunch.com/api/reference/1.0/extensions/extension_package/
export function getExtensionPackageForExtension(extensionId) {
  return this.get(`/extensions/${extensionId}/extension_package`);
}

// Get Extension's origin
// https://developer.adobelaunch.com/api/reference/1.0/extensions/origin/
export function getOriginForExtension(extensionId) {
  return this.get(`/extensions/${extensionId}/origin`);
}

// Get Extension's Property
// https://developer.adobelaunch.com/api/reference/1.0/extensions/property/
export function getPropertyForExtension(extensionId) {
  return this.get(`/extensions/${extensionId}/property`);
}

// List Extensions
// https://developer.adobelaunch.com/api/reference/1.0/extensions/list/
export function listExtensionsForProperty(propertyId, queryParams) {
  return this.get(`/properties/${propertyId}/extensions`, queryParams);
}

// List Extension's Libraries
// https://developer.adobelaunch.com/api/reference/1.0/extensions/libraries/
export function listLibrariesForExtension(extensionId) {
  return this.get(`/extensions/${extensionId}/libraries`);
}

// List Extension's revisions
// https://developer.adobelaunch.com/api/reference/1.0/extensions/revisions/
export function listRevisionsForExtension(extensionId) {
  return this.get(`/extensions/${extensionId}/revisions`);
}

// Revise Extension
// https://developer.adobelaunch.com/api/reference/1.0/extensions/revise/
export function reviseExtension(extensionId) {
  return this.patch(
    `/extensions/${extensionId}`,
    this.createReviseBody('extensions', extensionId)
  );
}

// Update Extension
// https://developer.adobelaunch.com/api/reference/1.0/extensions/update/
export function updateExtension(extensionId, extensionPatch) {
  return this.patch(`/extensions/${extensionId}`, {
    data: extensionPatch,
  });
}

// Create a note for Extension
// https://developer.adobelaunch.com/api/extensions/:extension_id/notes
export function createNoteForExtension(extensionId, note) {
  return this.post(`/extensions/${extensionId}/notes`, {
    data: note
  });
}
