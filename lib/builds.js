/***************************************************************************************
 * (c) 2018 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

export function createBuild(libraryId) {
  return this.post(`/libraries/${libraryId}/builds`);
}

export function getBuild(buildId) {
  return this.get(`/builds/${buildId}`);
}

export function getEnvironmentForBuild(buildId) {
  return this.get(`/builds/${buildId}/environment`);
}

export function getLibraryForBuild(buildId) {
  return this.get(`/builds/${buildId}/library`);
}

export function getDataElementsForBuild(buildId) {
  return this.get(`/builds/${buildId}/data_elements`);
}

export function listBuildsForLibrary(libraryId, queryParams) {
  return this.get(`/libraries/${libraryId}/builds`, queryParams);
}

export function listExtensionsForBuild(buildId, queryParams) {
  return this.get(`/builds/${buildId}/extensions`, queryParams);
}

export function listRulesForBuild(buildId, queryParams) {
  return this.get(`/builds/${buildId}/rules`, queryParams);
}
