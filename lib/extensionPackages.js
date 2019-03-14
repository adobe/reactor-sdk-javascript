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

// ExtensionPackages
// https://developer.adobelaunch.com/api/extension_packages

// Create an ExtensionPackage
// https://developer.adobelaunch.com/api/extension_packages/create/
// TODO: Figure out how to upload a file
export function createExtensionPackage(zipFile) {
  return this.sendMultipartFile('POST', '/extension_packages', zipFile);
}

// Get an ExtensionPackage
// https://developer.adobelaunch.com/api/extension_packages/fetch/
export function getExtensionPackage(extensionPackageId) {
  return this.get(`/extension_packages/${extensionPackageId}`);
}

// List ExtensionPackages
// https://developer.adobelaunch.com/api/extension_packages/list/
export function listExtensionPackages(queryParams) {
  return this.get('/extension_packages', queryParams);
}

// Private Release an ExtensionPackage
// https://developer.adobelaunch.com/api/extension_packages/release_private/
export function privateReleaseExtensionPackage(extensionPackageId) {
  return this.patch(`/extension_packages/${extensionPackageId}`, {
    attributes: {},
    meta: { action: 'release_private' },
    id: extensionPackageId,
    type: 'extension_packages'
  });
}

// Update an ExtensionPackage
// https://developer.adobelaunch.com/api/extension_packages/update/
export function updateExtensionPackage(extensionPackageId, zipFile) {
  return this.sendMultipartFile(
    'PATCH',
    `/extension_packages/${extensionPackageId}`,
    zipFile
  );
}
