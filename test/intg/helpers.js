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
    console.log(`[${helpers.specName}]`, error, { details: error });
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
      if (!propertyId) propertyId = helpers.createTestProperty(baseName).id;
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

  async createTestAdapter(propertyId, baseName) {
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

  async createTestEnvironment(propertyId, baseName, adapterId = null) {
    let ctx = `while creating "${baseName}" test Environment`;
    ctx += ` on ${propertyId} ${adapterId}:`;
    try {
      if (adapterId === null) {
        const adapter = await helpers.createTestAdapter(propertyId, baseName);
        adapterId = adapter.id;
      }
      const response = await reactor.createEnvironment(propertyId, {
        type: 'environments',
        attributes: {
          name: makeNameForTestObject('Environment', baseName),
          path: 'https:///example.com/',
          stage: 'development'
        },
        relationships: {
          adapter: { data: { type: 'adapters', id: adapterId } }
        }
      });
      expectWithContext(response.data.id, ctx).toMatch(helpers.idEN);
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
  async makeLibraryEnvironment(library, name = 'env') {
    const lId = library.id;
    const pId = library.relationships.property.data.id;
    const e = await helpers.createTestEnvironment(pId, name);
    const r = await reactor.setEnvironmentRelationshipForLibrary(lId, e.id);
    expect(r.data.id).toBe(e.id);
    expect(r.links.related).toContain(`/${lId}/`);
    expect(r.links.self).toMatch(`/libraries/${lId}/relationships/environment`);
    return e;
  },

  async cleanUpTestProperties() {
    const response = await reactor.listProperties(reactor.myCompanyId);
    const properties = response.data;
    expect(properties).toBeDefined();
    properties.forEach(async function(property) {
      expect(property.id).toMatch(helpers.idPR);
      const propName = property.attributes.name;
      if (nameMatcherForTestProperties.test(propName)) {
        console.log(`cleanup: deleting ${property.id} "${propName}"`);
        await reactor.deleteProperty(property.id);
      } else {
        console.log(`cleanup: leaving ${property.id} "${propName}"`);
      }
    });
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

  // Wraps the test in a try/catch that prints much more useful information
  // when an error is thrown. The default Jasmine report usually just says
  // `[object Object] thrown`, which is not very helpful.
  //
  // helpers.it() also puts the name of the spec into helpers.specName, which
  // can make error messages easier to locate in the source.
  it(description, testFn) {
    var spec = it(description, async function() {
      try {
        helpers.specName = spec.getFullName();
        await testFn.apply(this, arguments);
      } catch (error) {
        helpers.reportError(error);
      }
    });
    return spec;
  },
  fit(description, testFn) {
    var spec = fit(description, async function() {
      try {
        helpers.specName = spec.getFullName();
        await testFn.apply(this, arguments);
      } catch (error) {
        helpers.reportError(error);
      }
    });
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
    '.' +
    (date.getMilliseconds() < 100 ? '0' : '') +
    pad(date.getMilliseconds()) +
    dif +
    pad(tzo / 60) +
    ':' +
    pad(tzo % 60)
  );
}

function makeNameForTestObject(objectType, baseName) {
  const date = toLocalISOString(new Date());
  return `${baseName} (Integration Testing ${objectType} / ${date})`;
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

export { helpers as default };
