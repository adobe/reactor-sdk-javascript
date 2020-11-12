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

// DataElements
// https://developer.adobelaunch.com/api/data_elements

// Create a DataElement
// https://developer.adobelaunch.com/api/data_elements/create/
export function createDataElement(propertyId, dataElement) {
  return this.post(`/properties/${propertyId}/data_elements`, {
    data: dataElement
  });
}

// Delete a DataElement
// https://developer.adobelaunch.com/api/data_elements/delete/
export function deleteDataElement(dataElementId) {
  return this.delete(`/data_elements/${dataElementId}`);
}

// Get a DataElement
// https://developer.adobelaunch.com/api/data_elements/fetch/
export function getDataElement(dataElementId) {
  return this.get(`/data_elements/${dataElementId}`);
}

// Get the Extension
// https://developer.adobelaunch.com/api/data_elements/extension/
export function getExtensionForDataElement(dataElementId) {
  return this.get(`/data_elements/${dataElementId}/extension`);
}

// Get the Property
// https://developer.adobelaunch.com/api/data_elements/property/
export function getPropertyForDataElement(dataElementId) {
  return this.get(`/data_elements/${dataElementId}/property`);
}

// Get the origin
// https://developer.adobelaunch.com/api/data_elements/origin/
export function getOriginForDataElement(dataElementId) {
  return this.get(`/data_elements/${dataElementId}/origin`);
}

// List DataElements for a Property
// https://developer.adobelaunch.com/api/data_elements/list/
export function listDataElementsForProperty(propertyId, queryParams) {
  return this.get(`/properties/${propertyId}/data_elements`, queryParams);
}

// List the Libraries for a DataElement
// https://developer.adobelaunch.com/api/data_elements/libraries/
export function listLibrariesForDataElement(dataElementId, queryParams) {
  return this.get(`/data_elements/${dataElementId}/libraries`, queryParams);
}

// List the revisions for a DataElement
// https://developer.adobelaunch.com/api/data_elements/revisions/
export function listRevisionsForDataElement(dataElementId) {
  return this.get(`/data_elements/${dataElementId}/revisions`);
}

// Revise
// https://developer.adobelaunch.com/api/data_elements/revise/
export function reviseDataElement(dataElementId) {
  return this.patch(
    `/data_elements/${dataElementId}`,
    this.createReviseBody('data_elements', dataElementId)
  );
}

// Update a DataElement
// https://developer.adobelaunch.com/api/data_elements/update/
export function updateDataElement(dataElementPatch) {
  return this.patch(`/data_elements/${dataElementPatch.id}`, {
    data: dataElementPatch
  });
}

// Create a note for DataElement
// https://developer.adobelaunch.com/api/data_elements/:data_element_id/notes
export function createNoteForLibrary(dataElementId, note) {
  return this.post(`/data_elements/${dataElementId}/notes`, {
    data: note
  });
}
