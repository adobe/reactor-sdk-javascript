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
const globals = jasmine.getEnv().reactorIntegrationTestGlobals;
const nameMatcherForTestProperties = RegExp(
  'An Awesome Property - \\d\\d\\d\\d-\\d\\d-\\d\\d' +
    '|' +
    'Integration Testing \\w+ / \\d\\d\\d\\d-\\d\\d-\\d\\dT\\d\\d:\\d\\d:\\d\\d'
);

function expectWithContext(value, context) {
  return expect(value).withContext(context);
}

const helpers = {
  reactor: reactor,
  companyId: globals.COMPANY_ID,

  idAD: /^AD[0-9a-f]{32}$/i,
  idAE: /^AE[0-9a-f]{32}$/i,
  idBL: /^BL[0-9a-f]{32}$/i,
  idCB: /^CB[0-9a-f]{32}$/i,
  idCO: /^CO[0-9a-f]{32}$/i,
  idDE: /^DE[0-9a-f]{32}$/i,
  idEN: /^EN[0-9a-f]{32}$/i,
  idEP: /^EP[0-9A-F]{32}$/i,
  idEX: /^EX[0-9a-f]{32}$/i,
  idLB: /^LB[0-9a-f]{32}$/i,
  idPR: /^PR[0-9a-f]{32}$/i,
  idRC: /^RC[0-9a-f]{32}$/i,
  idRL: /^RL[0-9a-f]{32}$/i,
  idUR: /^UR[0-9a-f]{32}$/i,

  async findNamedExtensionPackage(name) {
    return await getExtensionPackageByName(name);
  },

  async coreExtensionPackage() {
    return await getCoreExtensionPackage();
  },

  async coreExtensionPackageId() {
    return await getCoreExtensionPackageId();
  },

  async coreExtension(property) {
    return await getCoreExtension(property);
  },

  async coreExtensionId(property) {
    return await getCoreExtensionId(property);
  },

  async coreExtensionRevisionId(property) {
    return await getCoreExtensionRevisionId(property);
  },

  async findAnalyticsExtension(property) {
    return await findAnalyticsExtension(property);
  },

  async makeAnalyticsExtension(property) {
    return await makeAnalyticsExtension(property);
  },

  async deleteAnalyticsExtension(property) {
    return await deleteAnalyticsExtension(property);
  },

  async analyticsExtension(property) {
    return (
      (await findAnalyticsExtension(property)) ||
      (await makeAnalyticsExtension(property))
    );
  },

  async sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  },

  reportError(error) {
    console.error(`[${helpers.specName}]`, error, { details: error });
    fail(error);
  },

  async createTestProperty(baseName) {
    const ctx = `while creating "${baseName}" test Property:`;
    try {
      const response = await reactor.createProperty(helpers.companyId, {
        attributes: {
          domains: ['testing.reactor.adobe.com'],
          name: makeNameForTestObject('Property', baseName),
          platform: 'web'
        },
        type: 'properties'
      });
      expectWithContext(response.data.id, ctx).toMatch(helpers.idPR);
      return response.data;
    } catch (error) {
      helpers.specName = ctx;
      helpers.reportError(error);
      return false;
    }
  },

  async createTestLibrary(propertyId, baseName) {
    const ctx = `while creating "${baseName}" test Library:`;
    try {
      if (!propertyId)
        propertyId = await helpers.createTestProperty(baseName).id;
      if (!propertyId) return false;
      const response = await reactor.createLibrary(propertyId, {
        attributes: {
          name: makeNameForTestObject('Library', baseName)
        },
        type: 'libraries'
      });
      expectWithContext(response.data.id, ctx).toMatch(helpers.idLB);
      return response.data;
    } catch (error) {
      helpers.specName = ctx;
      helpers.reportError(error);
      return false;
    }
  },

  async addCoreToLibrary(property, library) {
    if (library.coreExRevision) return library.coreExRevision.id; // already done

    const revId = await helpers.coreExtensionRevisionId(property);
    const addResponse = await reactor.addResourceRelationshipsToLibrary(
      library.id,
      [{ id: revId, type: 'extensions' }]
    );
    const addedIds = addResponse.data.map(resource => resource.id);
    expect(addedIds).toContain(revId);

    // Check whether they all show up when resources are listed
    const listResponse = await reactor.listResourceRelationshipsForLibrary(
      library.id
    );
    const listedIds = listResponse.data.map(resource => resource.id);
    expect(listedIds).toContain(revId);

    // property.coreExRevision is set by heleprs.coreExtensionRevisionId
    library.coreExRevision = property.coreExRevision;
    return revId;
  },

  async createTestSftpAdapter(propertyId, baseName) {
    const ctx = `while creating "${baseName}" test Adapter:`;
    try {
      /*eslint-disable camelcase*/
      const response = await reactor.createAdapter(propertyId, {
        attributes: {
          name: makeNameForTestObject('Adapter', baseName),
          type_of: 'sftp',
          username: 'John Doe',
          encrypted_private_key:
            '-----BEGIN PGP MESSAGE-----\n\n' +
            'this+is+a+bogus+private+key+nnnnaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n' +
            'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\n' +
            'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh\n' +
            'OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO++++++++++++++++++++++++++++++++\n' +
            'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN\n' +
            'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB77777777777777777777777777777777\n' +
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG\n' +
            'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW00000000000000000000000000000000\n' +
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD\n' +
            'jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE\n' +
            '8888888888888888888888888888888811111111111111111111111111111111\n' +
            'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTssssssssssssssssssssssssssssssss\n' +
            'LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL//////////==\n=oRpa\n' +
            '-----END PGP MESSAGE-----\n',
          host: 'example.com',
          path: 'assets',
          port: 22
        },
        type: 'adapters'
      });
      /*eslint-enable camelcase*/
      expectWithContext(response.data.id, ctx).toMatch(helpers.idAD);
      return response.data;
    } catch (error) {
      helpers.specName = ctx;
      helpers.reportError(error);
      return false;
    }
  },

  async createTestAkamaiAdapter(propertyId, baseName) {
    const ctx = `while creating "${baseName}" test Adapter:`;
    try {
      /*eslint-disable camelcase*/
      const response = await reactor.createAdapter(propertyId, {
        attributes: {
          name: makeNameForTestObject('Adapter', baseName),
          type_of: 'akamai'
        },
        type: 'adapters'
      });
      /*eslint-enable camelcase*/
      expectWithContext(response.data.id, ctx).toMatch(helpers.idAD);
      return response.data;
    } catch (error) {
      helpers.specName = ctx;
      helpers.reportError(error);
      return false;
    }
  },

  // Create an Environment using the identified Adapter.
  //
  // If adapterId is non-null and contains an Adapter ID, then that adapter
  // will be used on the new Environment.
  // If adapterId is non-null and contains the word Akamai (case-insensitive),
  // then a new Akamai adapter will be created for the new Environment.
  // Otherwise, a new SFTP adapter will be created for the new Environment.
  //
  // The returned environment object will have an 'associatedAdapterId' field
  // identifying the Adapter assigned to the environment.
  //
  // Creates a production Environment if baseName =~ /\bprod(uction)?\b/i.
  // Creates a staging Environment if baseName =~ /\bstag(e|ing)\b/i.
  // Otherwise, creates a development Environment.
  async createTestEnvironment(propertyId, baseName, adapterId = null) {
    let ctx = `while creating "${baseName}" test Environment`;
    ctx += ` on ${propertyId} ${adapterId}:`;
    try {
      const kind = determineAdapterKind(adapterId);
      if (kind === 'sftp') {
        const adapter = await helpers.createTestSftpAdapter(
          propertyId,
          baseName
        );
        adapterId = adapter.id;
      } else if (kind === 'akamai') {
        const adapter = await helpers.createTestAkamaiAdapter(
          propertyId,
          baseName
        );
        adapterId = adapter.id;
      }
      const attributes = {
        name: makeNameForTestObject('Environment', baseName),
        stage: determineEnvironmentStage(baseName)
      };
      if (kind !== 'akamai') {
        attributes.path = 'https://example.com/';
      }
      const response = await reactor.createEnvironment(propertyId, {
        type: 'environments',
        attributes: attributes,
        relationships: {
          adapter: { data: { type: 'adapters', id: adapterId } }
        }
      });
      expectWithContext(response.data.id, ctx).toMatch(helpers.idEN);
      response.data.associatedAdapterId = adapterId;
      return response.data;
    } catch (error) {
      helpers.specName = ctx;
      helpers.reportError(error);
      return false;
    }
  },

  // Caches core extension in propertyObj.coreEx
  async createTestDataElement(propertyObj, baseName) {
    let ctx = 'creating test data element';

    if (
      !propertyObj ||
      propertyObj.type !== 'properties' ||
      !propertyObj.id ||
      !helpers.idPR.test(propertyObj.id)
    ) {
      var error = new Error(
        '[createTestDataElement] property is not an object'
      );
      error.args = { propertyObj: propertyObj, baseName: baseName };
      throw error;
    } else if (typeof baseName !== 'string') {
      var error = new Error('[createTestDataElement] name is not a string');
      error.args = { propertyObj: propertyObj, baseName: baseName };
      throw error;
    }
    const coreExtensionId = await helpers.coreExtensionId(propertyObj);
    const name = makeNameForTestObject('DataElement', baseName);
    ctx = `creating test data element '${name}'`;
    const data = {
      /*eslint-disable camelcase*/
      attributes: {
        delegate_descriptor_id: 'core::dataElements::javascript-variable',
        name: name,
        settings: `{"path":"data_layer.zomg.${name}"}`
      },
      relationships: {
        extension: { data: { id: coreExtensionId, type: 'extensions' } }
      },
      type: 'data_elements'
      /*eslint-enable camelcase*/
    };

    const pid = propertyObj.id;
    const response = await reactor.createDataElement(pid, data);
    expectWithContext(response, ctx).toBeDefined();
    expectWithContext(response.data, ctx).toBeDefined();
    const theDataElement = response.data;
    expectWithContext(theDataElement.id, ctx).toMatch(helpers.idDE);
    expectWithContext(theDataElement.attributes.name, ctx).toBe(name);
    return theDataElement;
  },

  // create a new Environment and add it to the library
  async makeLibraryEnvironment(library, name = 'env', adapterId = null) {
    const lId = library.id;
    const pId = library.relationships.property.data.id;
    const e = await helpers.createTestEnvironment(pId, name, adapterId);
    const r = await reactor.setEnvironmentRelationshipForLibrary(lId, e.id);
    expect(r.data.id).toBe(e.id);
    expect(r.links.related).toContain(`/${lId}/`);
    expect(r.links.self).toMatch(`/libraries/${lId}/relationships/environment`);
    return e;
  },

  async buildLibrary(lib) {
    const buildResponse = await reactor.createBuild(lib.id);
    const buildId = buildResponse.data.id;
    expect(buildId).toMatch(helpers.idBL);

    // wait for build to complete
    const totalWait = 300000; // in milliseconds
    const pollInterval = 1000; // in milliseconds
    for (var i = 0; i < totalWait; i += pollInterval) {
      await helpers.sleep(pollInterval);
      var getBuildResponse = await reactor.getBuild(buildId);
      console.info(
        `after ${i + pollInterval} milliseconds, ${buildId} is ${
          getBuildResponse.data.attributes.status
        }`
      );
      if (getBuildResponse.data.attributes.status !== 'pending') break;
    }
    const status = getBuildResponse.data.attributes.status;
    expect(status).toBe('succeeded');
    return buildId;
  },

  async transitionLibrary(lib, action) {
    const response = await reactor.transitionLibrary(lib.id, action);
    let expectedState = 'unknown (action was "' + action + '")';
    if (action === 'submit') expectedState = 'submitted';
    if (action === 'approve') expectedState = 'approved';
    if (action === 'reject') expectedState = 'rejected';
    if (action === 'develop') expectedState = 'development';
    expect(response.data.attributes.state).toBe(expectedState);
    return response.data;
  },

  async cleanUpTestProperties() {
    const groupName = 'Clean up Properties from earlier integration tests';
    helpers.specName = groupName;
    console.groupCollapsed(groupName);
    try {
      await helpers.forEachEntityInList(
        paging => reactor.listPropertiesForCompany(helpers.companyId, paging),
        helpers.deleteTestProperty
      );
    } catch (error) {
      helpers.reportError(error);
    }
    console.groupEnd(groupName);
  },

  async deleteTestProperty(property) {
    expect(property.id).toMatch(helpers.idPR);
    const propName = property.attributes.name;
    if (nameMatcherForTestProperties.test(propName)) {
      console.debug(`cleanup: deleting ${property.id} "${propName}"`);
      await reactor.deleteProperty(property.id);
    } else {
      console.debug(`cleanup: not deleting ${property.id} "${propName}"`);
    }
  },

  async createTestRule(property, ruleName) {
    return await makeTestRule(property, ruleName);
  },

  async createTestRuleComponent(property, rule, ruleComponentName, order) {
    return await makeTestRuleComponent(
      property,
      rule,
      ruleComponentName,
      order
    );
  },

  // forEachEntityInList invokes `callback` on each entity listed in all the
  // pages returned by
  //  ```
  //    listPageFn({ 'page[number]': <NEXT_PAGE_NUMBER>, 'page[size]': 100 });
  // ```
  // In other words, forEachEntity passes to listPageFn the query parameters
  // that pertain to paging. Before calling the desired Reactor listFooForBar()
  // method, listPageFn should merge those paging parameters with any query
  // parameters it needs.
  //
  // listPageFn will be called for successive pages until the list is exhausted.
  //
  // The following is a usage example. Given a property ID and search string, it
  // returns an Array containing the ID's of all Libraries on that Property for
  // which the Library name contains the search string.
  //
  //   async function getIdsOfLibrariesWhoseNameContains(propertyId, searchString) {
  //     const ids = [];
  //     const query = { 'filter[name]': 'CONTAINS ' + searchString };
  //     await helpers.forEachEntityInList(
  //       // This function gets pages using a Reactor listFooForBar method:
  //       function(paging) {
  //         Object.assign(query, paging); // merge in the paging query parameters
  //         return reactor.listLibrariesForProperty(propertyId, query);
  //       },
  //       // This function gets called on each individual Foo in the list of
  //       // Foos for Bar. It may be called up to 100 times for each page
  //       // produced by the listPageFn.
  //       property => ids.push(property.id)
  //     );
  //   }
  async forEachEntityInList(listPageFn, callback) {
    try {
      /*eslint-disable camelcase*/
      let pagination = { next_page: 1 };
      do {
        const listResponse = await listPageFn({
          'page[number]': pagination.next_page,
          'page[size]': 100
        });
        const entities = listResponse.data;
        expect(entities).toBeDefined();
        for (const entity of entities) {
          await callback(entity);
        }
        pagination = listResponse.meta && listResponse.meta.pagination;
      } while (pagination.next_page);
    } catch (error) {
      helpers.reportError(error);
    }
    /*eslint-enable camelcase*/
  },

  describe(description, suiteDefinition) {
    describe(description, function() {
      beforeAll(() => console.groupCollapsed(description));
      afterAll(() => console.groupEnd(description));
      suiteDefinition.apply(this);
    });
  },
  fdescribe(description, suiteDefinition) {
    fdescribe(description, function() {
      beforeAll(() => console.groupCollapsed(description));
      afterAll(() => console.groupEnd(description));
      suiteDefinition.apply(this);
    });
  },

  // Wraps the test in a try/catch that prints much more useful information
  // when an error is thrown. The default Jasmine report usually just says
  // `[object Object] thrown`, which is not very helpful.
  //
  // helpers.it() also puts the name of the spec into helpers.specName, which
  // can make error messages easier to locate in the source.
  it(description, testFn, timeout) {
    var spec = it(
      description,
      async function() {
        console.groupCollapsed(description);
        try {
          helpers.specName = spec.getFullName();
          await testFn.apply(this, arguments);
        } catch (error) {
          helpers.reportError(error);
        }
        console.groupEnd(description);
      },
      timeout
    );
    return spec;
  },
  fit(description, testFn, timeout) {
    var spec = fit(
      description,
      async function() {
        console.group(description);
        try {
          helpers.specName = spec.getFullName();
          await testFn.apply(this, arguments);
        } catch (error) {
          helpers.reportError(error);
        }
        console.groupEnd(description);
      },
      timeout
    );
    return spec;
  },
  xit(description, testFn) {
    return xit(description, testFn);
  }
};

// Like String.prototype.toISOString(), but shows local time rather than GMT.
function toLocalISOString(date) {
  function pad(num, width = 2) {
    var norm = Math.floor(Math.abs(num));
    return (norm < 10 ? '0' : '') + norm;
  }
  var tzo = -date.getTimezoneOffset();
  var dif = tzo >= 0 ? '+' : '-';
  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':' +
    pad(date.getSeconds()) +
    dif +
    pad(tzo / 60) +
    ':' +
    pad(tzo % 60)
  );
}

function makeNameForTestObject(objectType, baseName) {
  const date = toLocalISOString(new Date());
  const rand = window.crypto
    .getRandomValues(new Uint32Array(1))[0]
    .toString(16);
  return `${baseName} (Integration Testing ${objectType} / ${date}) ${rand}`;
}

const testingProperties = new Map();

async function findOrMakeTestingProperty(entityKind) {
  if (!testingProperties.has(entityKind)) {
    const basename = `${entityKind}-Testing Base`;
    const property = await helpers.createTestProperty(basename);
    testingProperties.set(entityKind, property);
  }
  return testingProperties.get(entityKind);
}

async function getExtensionPackageByName(epName, platform = 'web') {
  const ctx = `getting Extension Package named '${epName}'`;

  // Get all web extension packages
  const response = await reactor.listExtensionPackages({
    'filter[platform]': `EQ ${platform}`,
    'filter[name]': `EQ ${epName}`
  });
  const eps = response.data;
  expectWithContext(eps, ctx).toBeDefined();
  // Find the EP named `epName`
  const ep = eps.find(ep => ep.attributes.name === epName);
  return ep;
}

let coreEp = null; // Cache the core extension package in this variable.
async function getCoreExtensionPackage() {
  if (!coreEp) coreEp = await getExtensionPackageByName('core', 'web');
  return coreEp;
}

async function getCoreExtensionPackageId() {
  const core = await getCoreExtensionPackage();
  return core.id;
}

// Caches the core extension in propertyObj.coreEx
async function getCoreExtension(property) {
  if (property.coreEx) return property.coreEx;

  const ctx = `getting core Extension ID for property ${property.id}`;
  expectWithContext(property.type, ctx).toBe('properties');

  // Get the extensions on this property.
  const response = await reactor.listExtensionsForProperty(property.id, {
    'filter[platform]': 'EQ web',
    'filter[name]': 'EQ core'
  });
  const exs = response.data;
  expectWithContext(exs, ctx).toBeDefined();
  // Find the extension whose extension package is 'core'.
  const coreEpId = await getCoreExtensionPackageId();
  const coreEx = exs.find(
    ep => ep.relationships.extension_package.data.id === coreEpId
  );
  expectWithContext(coreEx, ctx).toBeDefined();
  expectWithContext(coreEx.id, ctx).toMatch(helpers.idEX);
  expectWithContext(coreEx.attributes.name, ctx).toBe('core');
  property.coreEx = coreEx;
  return coreEx;
}

async function getCoreExtensionId(property) {
  const coreEx = await getCoreExtension(property);
  return coreEx.id;
}

// Caches core extension revision in property.coreExRevision
async function getCoreExtensionRevisionId(property) {
  if (property.coreExRevision) return property.coreExRevision.id;
  const coreExId = await getCoreExtensionId(property);
  const coreExRevision = (await reactor.reviseExtension(coreExId)).data;
  const ctx = `revising core Extension for property ${property.id}`;
  expectWithContext(coreExRevision.id, ctx).toMatch(helpers.idEX);
  property.coreExRevision = coreExRevision;
  return property.coreExRevision.id;
}

let analyticsEp = null; // Cache of analytics extension package
async function getAnalyticsExtensionPackage() {
  if (!analyticsEp) {
    analyticsEp = await getExtensionPackageByName('adobe-analytics', 'web');
  }
  expectWithContext(analyticsEp, 'Adobe Analyics EP needed').toBeDefined();
  return analyticsEp;
}

// Caches analytics extension in property.analyticsEx
async function findAnalyticsExtension(property) {
  let analyticsEx = property.analyticsEx || null;
  if (analyticsEx) return analyticsEx; // fast cache return

  const ctx = `getting analytics Extension ID for property ${property.id}`;
  expectWithContext(property.type, ctx).toBe('properties');

  // Get the all extensions on `property` named "adobe-analytics".
  const extensions = (await reactor.listExtensionsForProperty(property.id, {
    'filter[platform]': 'EQ web',
    'filter[name]': 'EQ adobe-analytics'
  })).data;
  if (extensions && extensions.length > 0) {
    // Find an extension whose extension package is also named "adobe-analytics".
    const analyticsEpId = (await getAnalyticsExtensionPackage()).id;
    analyticsEx = extensions.find(
      ex => ex.relationships.extension_package.data.id === analyticsEpId
    );
  }
  if (analyticsEx) {
    property.analyticsEx = analyticsEx;
  }
  return analyticsEx;
}

// Caches analytics extension in property.analyticsEx
async function makeAnalyticsExtension(property) {
  const ctx = `making analytics Extension ID for property ${property.id}`;
  expectWithContext(property.type, ctx).toBe('properties');

  const analyticsEpId = (await getAnalyticsExtensionPackage()).id;
  const data = {
    /*eslint-disable camelcase*/
    attributes: {
      delegate_descriptor_id: 'adobe-analytics::extensionConfiguration::config',
      settings: JSON.stringify({
        libraryCode: {
          accounts: {
            development: ['dev-tastic'],
            production: ['prod-a-licious'],
            staging: ['stag-issimo']
          },
          type: 'managed'
        }
      })
    },
    relationships: {
      extension_package: {
        data: { id: analyticsEpId, type: 'extension_packages' }
      }
    },
    type: 'extensions'
    /*eslint-enable camelcase*/
  };

  const createResponse = await reactor.createExtension(property.id, data);
  const analyticsEx = createResponse.data;
  property.analyticsEx = analyticsEx;
  return analyticsEx;
}

// Uncaches analytics extension from property.analyticsEx
async function deleteAnalyticsExtension(property) {
  if (property.analyticsEx) {
    await reactor.deleteExtension(property.analyticsEx.id);
    delete property.analyticsEx;
  }
}

async function makeTestRule(property, ruleBaseName) {
  const ruleName = makeNameForTestObject('Rule', ruleBaseName);
  const data = {
    attributes: { name: ruleName },
    type: 'rules'
  };

  // Create a click-event Rule on the Property
  const response = await reactor.createRule(property.id, data);
  const rule = response.data;

  // Verify that we built what we expected.
  expect(rule.id).toMatch(helpers.idRL);
  expect(rule.attributes.name).toBe(ruleName);
  expect(rule.relationships.property.data.id).toBe(property.id);
  return rule;
}

async function makeTestRuleComponent(
  property,
  rule,
  ruleComponentBaseName,
  order
) {
  const ruleComponentName = makeNameForTestObject(
    'RuleComponent',
    ruleComponentBaseName
  );
  const coreEx = await getCoreExtension(property);
  const data = {
    /*eslint-disable camelcase*/
    attributes: {
      name: ruleComponentName,
      settings: JSON.stringify({
        bubbleFireIfChildFired: true,
        bubbleFireIfParent: true,
        elementSelector: 'a#checkout'
      }),
      order: order,
      delegate_descriptor_id: 'core::events::click'
    },
    relationships: {
      extension: {
        data: {
          id: coreEx.id,
          type: 'extensions'
        }
      }
    },
    type: 'rule_components'
    /*eslint-enable camelcase*/
  };

  // Create a RuleComponent on the Rule
  const response = await reactor.createRuleComponent(rule.id, data);
  const ruleComponent = response.data;

  // Verify that we built what we expected.
  expect(ruleComponent.id).toMatch(helpers.idRC);
  expect(ruleComponent.attributes.name).toBe(ruleComponentName);
  expect(ruleComponent.relationships.rule.data.id).toBe(rule.id);
  expect(ruleComponent.relationships.extension.data.id).toBe(coreEx.id);
  return ruleComponent;
}

function determineAdapterKind(adapterId) {
  const kind = adapterId;
  if (adapterId === null) return 'sftp';
  if (adapterId.match(helpers.idEN)) return adapterId;
  if (adapterId.match(/\bakamai\b/i)) return 'akamai';
  return 'sftp';
}

function determineEnvironmentStage(environmentBaseName) {
  if (environmentBaseName === null) return 'development';
  if (environmentBaseName.match(/\bprod(uction)?\b/i)) return 'production';
  if (environmentBaseName.match(/\bstag(e|ing)\b/i)) return 'staging';
  return 'development';
}

export { helpers as default };
