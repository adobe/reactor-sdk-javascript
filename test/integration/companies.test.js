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

import reactor from './reactor';
import helpers from './helpers';

// Companies
// https://developer.adobelaunch.com/api/companies
helpers.describe('Company API', function() {
  // Get a Company
  // https://developer.adobelaunch.com/api/companies/fetch/
  helpers.it('gets a Company', async function() {
    const response = await reactor.getCompany(helpers.companyId);
    const prop = response.data;
    expect(prop.id).toBe(helpers.companyId);
  });

  // List Companies
  // https://developer.adobelaunch.com/api/companies/list/
  helpers.it('lists all Companies', async function() {
    const companyIds = await getAllCompanyIds();
    for (const companyId of companyIds) {
      expect(companyId).toMatch(helpers.idCO);
    }
    expect(companyIds).toContain(helpers.companyId);
  });
});

async function getAllCompanyIds() {
  /*eslint-disable camelcase*/
  const theCompanyIds = [];
  let pagination = { next_page: 1 };
  do {
    const listResponse = await reactor.listCompanies({
      'page[number]': pagination.next_page,
      'page[size]': 100
    });
    expect(typeof listResponse.data).not.toBeNull();
    for (const aCompanyId of listResponse.data) {
      theCompanyIds.push(aCompanyId.id);
    }
    pagination = listResponse.meta && listResponse.meta.pagination;
  } while (pagination.next_page);
  return theCompanyIds;
  /*eslint-enable camelcase*/
}
