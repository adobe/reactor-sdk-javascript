#!/usr/bin/env node
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

const { default: Reactor } = require('@adobe/reactor-sdk');

const datePattern = '\\d\\d\\d\\d-\\d\\d-\\d\\d';
const integrationTestingPropertyNameMatcher = RegExp(
  `(?:An Awesome Property|Integration Testing \\w+) . ${datePattern}`
);

async function deleteIfTestProperty(reactor, property) {
  try {
    const propName = property.attributes.name;
    if (integrationTestingPropertyNameMatcher.test(propName)) {
      console.debug(`Cleanup: deleting ${property.id} "${propName}"`);
      await reactor.deleteProperty(property.id);
      return true;
    } else {
      console.debug(`Cleanup: not deleting ${property.id} "${propName}"`);
    }
  } catch (error) {
    console.error(error, 'while processing', property);
  }
  return false;
}

async function deleteTestPropertiesFor(reactor, companyId) {
  /*eslint-disable camelcase*/
  var property_count = 0;
  var delete_count = 0;
  let pagination = { next_page: 1 };
  try {
    do {
      const listResponse = await reactor.listPropertiesForCompany(companyId, {
        'page[number]': pagination.next_page,
        'page[size]': 100,
        next_page: pagination.next_page
      });
      const properties = listResponse.data;
      for (const property of properties) {
        property_count++;
        var deleted = await deleteIfTestProperty(reactor, property);
        if (deleted) delete_count++;
      }
      pagination = listResponse.meta.pagination;
    } while (pagination.next_page);
  } catch (error) {
    console.error(error, 'while processing page #', pagination.next_page);
  }
  return [property_count, delete_count];
  /*eslint-enable camelcase*/
}

function env(varName, exampleValue) {
  if (process.env[varName]) return process.env[varName];
  console.error(`${varName} must be defined`);
  console.info(`  for example: export ${varName}='${exampleValue}'`);
  errors++;
}

async function main() {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
  var errors = 0;
  var companyId = env('COMPANY_ID', 'CO1234567890abcdef1234567890abcdef');
  var accessToken = env('ACCESS_TOKEN', 'eyJiOi...(lots more here)....YiHkRLQ');
  var reactorUrl = process.env.REACTOR_URL || 'https://reactor.adobe.io';
  if (errors > 0) process.exit(1);

  var reactor = new Reactor(accessToken, { reactorUrl: reactorUrl });
  const groupName = 'Clean up Properties from earlier integration tests';
  console.groupCollapsed(groupName);
  var counts = await deleteTestPropertiesFor(reactor, companyId);
  console.groupEnd(groupName);
  return counts;
}

main().then(
  function(result) {
    console.log(`Deleted ${result[1]} of the ${result[0]} properties examined`);
  },
  function(err) {
    console.log(err);
  }
);
