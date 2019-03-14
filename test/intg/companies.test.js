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
describe('Company API', function() {
  // Get a Company
  // https://developer.adobelaunch.com/api/companies/fetch/
  it('gets a Company', async function() {
    const response = await reactor.getCompany(helpers.companyId);
    const prop = response.data;
    expect(prop.id).toBe(helpers.companyId);
  });

  // List Companies
  // https://developer.adobelaunch.com/api/companies/list/
  it('lists all Companies', async function() {
    const response = await reactor.listCompanies();
    const companies = response.data;
    companies.forEach(company => {
      expect(company.id).toMatch(helpers.idCO);
    });
    const companyIds = companies.map(resource => resource.id);
    expect(companyIds).toContain(helpers.companyId);
  });
});
