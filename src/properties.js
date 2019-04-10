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

export function createProperty(companyId, property) {
  return this.post(`/companies/${companyId}/properties`, { data: property });
}

export function getProperty(propertyId) {
  return this.get(`/properties/${propertyId}`);
}

export function getCompanyForProperty(propertyId) {
  return this.get(`/properties/${propertyId}/company`);
}

export function listPropertiesForCompany(companyId, queryParams) {
  return this.get(`/companies/${companyId}/properties`, queryParams);
}

export function updateProperty(propertyPatch) {
  return this.patch(`/properties/${propertyPatch.id}`, { data: propertyPatch });
}

export function deleteProperty(propertyId) {
  return this.delete(`/properties/${propertyId}`);
}
