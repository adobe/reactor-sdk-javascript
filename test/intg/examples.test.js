/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance with the License. You
may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
REPRESENTATIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
*/
import Reactor from '../../lib/reactor.js';

const globals = jasmine.getEnv().reactorIntegrationTestGlobals;
describe('Reactor SDK Example', function() {
  if (!disableJasmineRandomStepOrder()) return;

  // CREDIT: The actions of this script are inspired by
  // [Reactor Postman](https://github.com/Adobe-Marketing-Cloud/reactor-postman).
  runStep('create a Property', makeNewAwesomePR);
  runStep('find ExtensionPackages', findThreeEP);
  runStep('find core Extension', findCoreEX);
  runStep('install Adobe Analytics Extension', makeAdobeAnalyticsEX);
  runStep('create shopping-cart DataElement', makeShoppingCartDE);
  runStep('create product-id DataElement', makeProductIdDE);
  runStep('create click-event Rule', makeClickEventRL);
  runStep('add click-event RuleComponent', makeClickEventRC);
  runStep('add browser-condition RuleComponent', makeBrowserConditionRC);
  runStep('add send-beacon RuleComponent', makeSendBeaconRC);
  runStep('install Facebook Pixel Extension', makeFacebookPixelEX);
  runStep('add Facebook add-to-cart RuleComponent', makeAddToCartRC);
  runStep('add Akamai Adapter', makeAkamaiAD);
  runStep('create an Akamai Environment', makeAkamaiEN);
  runStep('create a Library', makeBibliotecaLB);
  runStep('post a Build to the Library', makeBuildBL);
  runStep('check Build status', checkBuildStatus);
});

function runStep(description, asyncFunctionImplementingTheNextStep) {
  it(description, async function() {
    try {
      await asyncFunctionImplementingTheNextStep();
    } catch (error) {
      expect(error).toBeNull();
    }
  });
}

// Turn off Jasmine's step-order randomization.
function disableJasmineRandomStepOrder() {
  // This code uses the Jasmine unit-testing framework. Jasmine executes the
  // functions given to `it(...)` in some random order, which is appropriate for
  // unit-testing. But this code is not actually a set of unit-tests, and the
  // steps really needed to be executed in the defined order. (We're using
  // Jasmine as a handy implementation of assertions and error-reporting, not as
  // a unit-testing framework.)
  const jasmineConfigure = jasmine.getEnv().configure;
  // jasmineConfigure allows this to be specified, in most environments.
  if (typeof jasmineConfigure !== 'function') {
    const message =
      'not running this example because ' +
      'Jasmine step-order randomization cannot be disabled';
    it(message, pending); // pending() tells Jasmine to skip this "test"
    return false;
  } else {
    jasmineConfigure({ random: false });
    return true;
  }
}

// Like String.prototype.toISOString(), but using local time instead of Zulu.
function toLocalISOString(date) {
  function pad(num, width = 2) {
    var norm = Math.floor(Math.abs(num));
    var hundreds = width === 3 && norm < 100 ? '0' : '';
    var tens = norm < 10 ? '0' : '';
    return hundreds + tens + norm;
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
    pad(date.getMilliseconds(), 3) +
    dif +
    pad(tzo / 60) +
    ':' +
    pad(tzo % 60)
  );
}

// The steps in this example build on each other, so they need to share a lot of
// information. For example:
//    - the reactor client object that provides the Reactor SDK
//    - the ID of the property created in the first step
//    - the ID's of certain Extension Packages and Extensions
//    - etc.
// This sharing is implemented by the following global-ish variables.

const reactor = new Reactor(globals.ACCESS_TOKEN, {
  reactorUrl: globals.REACTOR_URL
});

// Global variables holding object ID's. Variable names end in a two-letter code
// indicating the referenced object's type (PR=Property, EX=Extension, etc).
//
var awesomePR; // set by makeNewAwesomePR()

// Extension Package ID's. Set by findThreeEP.
var coreEP;
var adobeAnalyticsEP;
var facebookPixelEP;

// Extension ID's.
var coreEX; // set by findCoreEX
var adobeAnalyticsEX; // set by makeAdobeAnalyticsEX
var facebookPixelEX; // set by makeFacebookPixelEX

// DataElement, Rule, and RuleComponent ID's.
var shoppingCartDE; // set by makeShoppingCartDE
var productIdDE; // set by makeProductIdDE
var clickEventRL; // set by makeClickEventRL
var clickEventRC; // set by makeClickEventRC
var browserConditionRC; // set by makeBrowserConditionRC
var sendBeaconRC; // set by makeSendBeaconRC
var addToCartRC; // set by makeAddToCartRC
var akamaiAD; // set by makeAkamaiAD
var akamaiEN; // set by makeAkamaiEN
var bibliotecaLB; // set by makeBibliotecaLB
var buildBL; // set by makeBuildBL
//
// End of global object ID's.

// Construct a Property to contain all the other objects created in this
// example.
async function makeNewAwesomePR() {
  const dateString = toLocalISOString(new Date());
  const propertyName = `An Awesome Property - ${dateString}`;
  const propertySpec = {
    attributes: { domains: ['adobe.com'], name: propertyName, platform: 'web' },
    type: 'properties'
  };
  const myCompany = globals.COMPANY_ID;

  // Create a new Property on the Company
  const response = await reactor.createProperty(myCompany, propertySpec);
  const property = response.data;
  awesomePR = property.id;

  // Verify that we built what we expected.
  expect(property.attributes.name).toBe(propertyName);
  expect(property.id).toMatch(/^PR[0-9A-F]{32}$/i);
}

async function findThreeEP() {
  // Get extension packages, selecting those for the web platform
  const response = await reactor.listExtensionPackages({
    'filter[platform]': 'EQ web',
    /*eslint-disable camelcase*/
    max_availability: 'private',
    /*eslint-enable camelcase*/
    sort: '+name'
  });
  const eps = response.data;
  expect(eps.length).toBeGreaterThan(0);

  // Locate the three extension packages we'll be using.
  // TODO: What if there are so many extension packages that they're paged
  // by the API? In that case, `eps` will not have the whole list.
  const rc = eps.find(ep => ep.attributes.name === 'core');
  const aa = eps.find(ep => ep.attributes.name === 'adobe-analytics');
  const fb = eps.find(ep => ep.attributes.name === 'facebook-pixel');
  coreEP = rc.id;
  adobeAnalyticsEP = aa.id;
  facebookPixelEP = fb.id;

  // Verify that we found what we needed.
  expect(rc.attributes.name).toBe('core');
  expect(aa.attributes.name).toBe('adobe-analytics');
  expect(fb.attributes.name).toBe('facebook-pixel');
  expect(coreEP).toMatch(/^EP[0-9A-F]{32}$/i);
  expect(adobeAnalyticsEP).toMatch(/^EP[0-9A-F]{32}$/i);
  expect(facebookPixelEP).toMatch(/^EP[0-9A-F]{32}$/i);
}

async function findCoreEX() {
  // Get extensions available for this property.
  const response = await reactor.listExtensionsForProperty(awesomePR);
  const exts = response.data;

  // Locate the core extension. It's the one whose Extension Package is
  // coreEP.
  const coreExtension = exts.find(
    ep => ep.relationships.extension_package.data.id === coreEP
  );
  coreEX = coreExtension.id;

  // Verify that we found what we needed.
  expect(coreExtension.relationships.extension_package.data.id).toBe(coreEP);
  expect(coreEX).toMatch(/^EX[0-9A-F]{32}$/i);
}

async function makeAdobeAnalyticsEX() {
  const fileTypes = [].concat(
    ['doc', 'docx', 'eps', 'jpg', 'png', 'svg', 'xls', 'ppt', 'pptx', 'pdf'],
    ['xlsx', 'tab', 'csv', 'zip', 'txt', 'vsd', 'vxd', 'xml', 'js', 'css'],
    ['rar', 'exe', 'wma', 'mov', 'avi', 'wmv', 'mp3', 'wav', 'm4v']
  );
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
        },
        trackerProperties: {
          eVars: [{ type: 'value', name: 'eVar4', value: '%shopping_cart%' }],
          linkDownloadFileTypes: fileTypes,
          trackDownloadLinks: true,
          trackExternalLinks: true,
          trackInlineStats: true
        }
      })
    },
    relationships: {
      extension_package: {
        data: {
          id: adobeAnalyticsEP,
          type: 'extension_packages'
        }
      }
    },
    type: 'extensions'
    /*eslint-enable camelcase*/
  };

  // Create an Extension based on the Adobe Analytics Extension Package
  const response = await reactor.createExtension(awesomePR, data);
  const extension = response.data;

  adobeAnalyticsEX = extension.id;

  // Verify that we built what we expected.
  expect(adobeAnalyticsEX).toMatch(/^EX[0-9A-F]{32}$/i);
  expect(extension.attributes.name).toBe('adobe-analytics');
  expect(extension.attributes.display_name).toBe('Adobe Analytics');
  expect(extension.relationships.extension_package.data.id).toBe(
    adobeAnalyticsEP
  );
}

async function makeShoppingCartDE() {
  const data = {
    /*eslint-disable camelcase*/
    attributes: {
      clean_text: false,
      default_value: '0',
      delegate_descriptor_id: 'core::dataElements::javascript-variable',
      enabled: true,
      force_lowercase: false,
      name: 'shopping_cart',
      settings: '{"path":"data_layer.zomg.shopping_cart"}',
      storage_duration: 'session'
    },
    relationships: {
      extension: {
        data: {
          id: coreEX,
          type: 'extensions'
        }
      }
    },
    type: 'data_elements'
    /*eslint-enable camelcase*/
  };

  // Create a "shopping_cart" DataElement on the Property
  const response = await reactor.createDataElement(awesomePR, data);
  const dataElement = response.data;

  shoppingCartDE = dataElement.id;

  // Verify that we built what we expected.
  expect(shoppingCartDE).toMatch(/^DE[0-9A-F]{32}$/i);
  expect(dataElement.attributes.name).toBe('shopping_cart');
  expect(dataElement.relationships.extension.data.id).toBe(coreEX);
}

async function makeProductIdDE() {
  const data = {
    /*eslint-disable camelcase*/
    attributes: {
      clean_text: false,
      default_value: '',
      delegate_descriptor_id: 'core::dataElements::dom-attribute',
      enabled: true,
      force_lowercase: false,
      name: 'product_id',
      settings: '{"elementSelector":"div#product","elementProperty":"id"}',
      storage_duration: 'pageview'
    },
    relationships: {
      extension: {
        data: {
          id: coreEX,
          type: 'extensions'
        }
      }
    },
    type: 'data_elements'
    /*eslint-enable camelcase*/
  };

  // Create a "product_id" DataElement
  const response = await reactor.createDataElement(awesomePR, data);
  const dataElement = response.data;

  productIdDE = dataElement.id;

  // Verify that we built what we expected.
  expect(productIdDE).toMatch(/^DE[0-9A-F]{32}$/i);
  expect(dataElement.attributes.name).toBe('product_id');
  expect(dataElement.relationships.extension.data.id).toBe(coreEX);
}

async function makeClickEventRL() {
  const data = {
    attributes: { name: 'Click Event Rule' },
    type: 'rules'
  };

  // Create a click-event Rule on the Property
  const response = await reactor.createRule(awesomePR, data);
  const rule = response.data;

  clickEventRL = rule.id;

  // Verify that we built what we expected.
  expect(clickEventRL).toMatch(/^RL[0-9A-F]{32}$/i);
  expect(rule.attributes.name).toBe('Click Event Rule');
  expect(rule.relationships.property.data.id).toBe(awesomePR);
}

async function makeClickEventRC() {
  const data = {
    /*eslint-disable camelcase*/
    attributes: {
      name: 'click-event',
      settings: JSON.stringify({
        bubbleFireIfChildFired: true,
        bubbleFireIfParent: true,
        elementSelector: 'a#checkout'
      }),
      order: 0,
      delegate_descriptor_id: 'core::events::click'
    },
    relationships: {
      extension: {
        data: {
          id: coreEX,
          type: 'extensions'
        }
      }
    },
    type: 'rule_components'
    /*eslint-enable camelcase*/
  };

  // Create a click-event RuleComponent on the Rule
  const response = await reactor.createRuleComponent(clickEventRL, data);
  const ruleComponent = response.data;

  clickEventRC = ruleComponent.id;

  // Verify that we built what we expected.
  expect(clickEventRC).toMatch(/^RC[0-9A-F]{32}$/i);
  expect(ruleComponent.attributes.name).toBe('click-event');
  expect(ruleComponent.relationships.rule.data.id).toBe(clickEventRL);
  expect(ruleComponent.relationships.extension.data.id).toBe(coreEX);
}

async function makeBrowserConditionRC() {
  const data = {
    /*eslint-disable camelcase*/
    attributes: {
      delegate_descriptor_id: 'core::conditions::browser',
      name: 'browser-condition',
      order: 0,
      settings: '{"browsers":["Chrome"]}'
    },
    relationships: {
      extension: {
        data: {
          id: coreEX,
          type: 'extensions'
        }
      }
    },
    type: 'rule_components'
    /*eslint-enable camelcase*/
  };

  // Create a browser-condition RuleComponent on the Rule
  const response = await reactor.createRuleComponent(clickEventRL, data);
  const ruleComponent = response.data;

  browserConditionRC = ruleComponent.id;

  // Verify that we built what we expected.
  expect(browserConditionRC).toMatch(/^RC[0-9A-F]{32}$/i);
  expect(ruleComponent.attributes.name).toBe('browser-condition');
  expect(ruleComponent.relationships.rule.data.id).toBe(clickEventRL);
  expect(ruleComponent.relationships.extension.data.id).toBe(coreEX);
}

async function makeSendBeaconRC() {
  const data = {
    /*eslint-disable camelcase*/
    attributes: {
      delegate_descriptor_id: 'adobe-analytics::actions::set-variables',
      name: 'analytics-action',
      order: 0,
      settings: JSON.stringify({
        trackerProperties: {
          eVars: [
            { type: 'value', name: 'eVar2', value: '%shopping_cart%' },
            { type: 'value', name: 'eVar3', value: '%product_id%' }
          ],
          props: [{ type: 'value', value: 'purchase', name: 'prop2' }]
        }
      })
    },
    type: 'rule_components',
    relationships: {
      extension: {
        data: {
          id: adobeAnalyticsEX,
          type: 'extensions'
        }
      }
    }
    /*eslint-enable camelcase*/
  };

  // Create a send-beacon RuleComponent on the Rule
  const response = await reactor.createRuleComponent(clickEventRL, data);
  const ruleComponent = response.data;

  sendBeaconRC = ruleComponent.id;

  // Verify that we built what we expected.
  expect(sendBeaconRC).toMatch(/^RC[0-9A-F]{32}$/i);
  expect(ruleComponent.attributes.name).toBe('analytics-action');
  expect(ruleComponent.relationships.rule.data.id).toBe(clickEventRL);
  expect(ruleComponent.relationships.extension.data.id).toBe(adobeAnalyticsEX);
}

async function makeFacebookPixelEX() {
  const data = {
    /*eslint-disable camelcase*/
    attributes: {
      delegate_descriptor_id: 'facebook-pixel::extensionConfiguration::config',
      settings: '{"pixelId": "123456789"}'
    },
    relationships: {
      extension_package: {
        data: {
          id: facebookPixelEP,
          type: 'extension_packages'
        }
      }
    },
    type: 'extensions'
    /*eslint-enable camelcase*/
  };

  // Create an Extension based on the Facebook Pixel Extension Package
  const response = await reactor.createExtension(awesomePR, data);
  const extension = response.data;

  facebookPixelEX = extension.id;

  // Verify that we built what we expected.
  expect(facebookPixelEX).toMatch(/^EX[0-9A-F]{32}$/i);
  expect(extension.attributes.name).toBe('facebook-pixel');
  expect(extension.attributes.display_name).toBe('Facebook Pixel');
  expect(extension.relationships.extension_package.data.id).toBe(
    facebookPixelEP
  );
}

async function makeAddToCartRC() {
  const data = {
    /*eslint-disable camelcase*/
    attributes: {
      delegate_descriptor_id: 'facebook-pixel::actions::send-add-to-cart-event',
      name: 'facebook-event',
      order: 0,
      settings: '{"value":"%shopping_cart%","currency":"USD"}'
    },
    relationships: {
      extension: {
        data: {
          id: facebookPixelEX,
          type: 'extensions'
        }
      }
    },
    type: 'rule_components'
    /*eslint-enable camelcase*/
  };

  // Create a send-beacon RuleComponent on the Rule
  const response = await reactor.createRuleComponent(clickEventRL, data);
  const ruleComponent = response.data;

  addToCartRC = ruleComponent.id;

  // Verify that we built what we expected.
  expect(addToCartRC).toMatch(/^RC[0-9A-F]{32}$/i);
  expect(ruleComponent.attributes.name).toBe('facebook-event');
  expect(ruleComponent.relationships.rule.data.id).toBe(clickEventRL);
  expect(ruleComponent.relationships.extension.data.id).toBe(facebookPixelEX);
}

async function makeAkamaiAD() {
  const data = {
    /*eslint-disable camelcase*/
    attributes: { name: 'Cloudy Cloud', type_of: 'akamai' },
    type: 'adapters'
    /*eslint-enable camelcase*/
  };

  // Create a new Adapter on the Property.
  const response = await reactor.createAdapter(awesomePR, data);
  const adapter = response.data;

  akamaiAD = adapter.id;

  // Verify that we built what we expected.
  expect(akamaiAD).toMatch(/^AD[0-9A-F]{32}$/i);
  expect(adapter.attributes.name).toBe('Cloudy Cloud');
  expect(adapter.relationships.property.data.id).toBe(awesomePR);
}

async function makeAkamaiEN() {
  const data = {
    /*eslint-disable camelcase*/
    attributes: {
      archive: false,
      name: 'My Precious',
      path: '',
      stage: 'development'
    },
    relationships: {
      adapter: {
        data: {
          id: akamaiAD,
          type: 'adapters'
        }
      }
    },
    type: 'environments'
    /*eslint-enable camelcase*/
  };

  // Create a new Environment on the Property.
  const response = await reactor.createEnvironment(awesomePR, data);
  const environment = response.data;

  akamaiEN = environment.id;

  // Verify that we built what we expected.
  expect(akamaiEN).toMatch(/^EN[0-9A-F]{32}$/i);
  expect(environment.attributes.name).toBe('My Precious');
  expect(environment.relationships.property.data.id).toBe(awesomePR);
  expect(environment.relationships.adapter.data.id).toBe(akamaiAD);
}

async function makeBibliotecaLB() {
  const data = {
    /*eslint-disable camelcase*/
    attributes: {
      name: 'Primera Biblioteca'
    },
    relationships: {
      environment: {
        data: {
          id: akamaiEN,
          type: 'environments'
        }
      },
      resources: {
        data: [
          {
            id: shoppingCartDE,
            meta: { action: 'revise' },
            type: 'data_elements'
          },
          {
            id: productIdDE,
            meta: { action: 'revise' },
            type: 'data_elements'
          },
          { id: clickEventRL, meta: { action: 'revise' }, type: 'rules' },
          { id: coreEX, meta: { action: 'revise' }, type: 'extensions' },
          {
            id: adobeAnalyticsEX,
            meta: { action: 'revise' },
            type: 'extensions'
          },
          {
            id: facebookPixelEX,
            meta: { action: 'revise' },
            type: 'extensions'
          }
        ]
      }
    },
    type: 'libraries'
    /*eslint-enable camelcase*/
  };

  // Create a new Library on the Property.
  const response = await reactor.createLibrary(awesomePR, data);
  const library = response.data;

  bibliotecaLB = library.id;

  // Verify that we built what we expected.
  expect(bibliotecaLB).toMatch(/^LB[0-9A-F]{32}$/i);
  expect(library.attributes.name).toBe('Primera Biblioteca');
  expect(library.relationships.property.data.id).toBe(awesomePR);
  expect(library.relationships.environment.data.id).toBe(akamaiEN);

  // Because the library references _revisions_ of the resources, the resource
  // ID's the libary references will not match shoppingCartDE, productIdDE,
  // clickEventRL, coreEX, adobeAnalyticsEX, and facebookPixelEX.  But we can at
  // least check that its resources are exactly: two DataElements, three
  // Extensions, and one Rule.
  const resourceTypes = library.relationships.resources.data
    .map(resource => resource.id.substring(0, 2))
    .sort();
  expect(resourceTypes).toEqual(['DE', 'DE', 'EX', 'EX', 'EX', 'RL']);
}

// Post a Build to the Library.
async function makeBuildBL() {
  const response = await reactor.createBuild(bibliotecaLB);
  const build = response.data;

  buildBL = build.id;

  // Verify that the build is as expected.
  expect(buildBL).toMatch(/^BL[0-9A-F]{32}$/i);
  expect(build.relationships.environment.data.id).toBe(akamaiEN);
  expect(build.relationships.library.data.id).toBe(bibliotecaLB);
}

// Check Build status.
async function checkBuildStatus() {
  const response = await reactor.getBuild(buildBL);
  const build = response.data;

  // Verify the build status.
  expect(build.id).toBe(buildBL);
  expect(['succeeded', 'pending', 'failed']).toContain(build.attributes.status);
}
