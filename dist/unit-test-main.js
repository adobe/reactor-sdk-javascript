// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"OjAK":[function(require,module,exports) {
module.exports = {
  "engines": {
    "node": ">10.15.1"
  },
  "name": "@adobe/reactor-sdk-node",
  "version": "0.0.1",
  "description": "JavaScript SDK for the Reactor API",
  "repository": {
    "type": "git",
    "url": "git@git.corp.adobe.com:reactor/reactor-sdk-node.git"
  },
  "author": {
    "name": "Adobe Systems",
    "url": "http://adobe.com",
    "email": "reactor@adobe.com"
  },
  "main": "./lib/reactor.js",
  "browserslist": ["last 2 chrome versions", "last 2 firefox versions", "last 2 safari versions"],
  "devDependencies": {
    "babel-core": "6.26.3",
    "babel-preset-env": "1.7.0",
    "eslint": "5.15.1",
    "eslint-config-prettier": "4.1.0",
    "eslint-plugin-prettier": "3.0.1",
    "jasmine": "3.3.1",
    "nock": "10.0.6",
    "nodemon": "1.18.10",
    "parcel-bundler": "1.12.0",
    "prettier": "1.16.4"
  },
  "scripts": {
    "test:lint": "eslint --fix --parser-options=ecmaVersion:8 '{lib,test/spec}/**/*.js'",
    "test:build": "node_modules/.bin/parcel build --no-minify -o dist/unit-test-main.js test/spec/main.js --target node",
    "test:run": "node_modules/.bin/jasmine dist/unit-test-main.js",
    "test:lint-build-run": "clear; npm run test:lint && npm run test:build && npm run test:run",
    "test": "npm run test:run",
    "watch": "./node_modules/nodemon/bin/nodemon.js -w test/spec/ -w lib/ --exec npm run test:lint-build-run",
    "integration:lint": "node_modules/.bin/eslint --fix --parser-options=ecmaVersion:8 --ignore-pattern='test/intg/lib/jasmine*/**' '{lib,test/intg}/**/*.js'",
    "integration:build:environment": "ACCESS_TOKEN=${REACTOR_API_TOKEN} COMPANY_ID=${REACTOR_TEST_COMPANY_ID} REACTOR_URL=${REACTOR_TEST_URL} node test/intg/write-reactor-environment.js",
    "integration:build": "npm run integration:build:environment && ./node_modules/.bin/parcel build --no-minify -o dist/intg-tests-browser.js test/intg/allTestsForBrowser.js",
    "integration:run": "open test/intg/SpecRunner.html",
    "integration:lint-build-run": "npm run integration:lint && npm run integration:build && npm run integration:run",
    "integration:test": "npm run integration:run",
    "integration:watch": "node_modules/.bin/nodemon --watch test/intg/ --watch lib/ --exec 'npm run integration:lint-build-run'"
  },
  "nodemonConfig": {
    "ignore": ["test/intg/globalsForBrowser.js"]
  },
  "license": "Apache-2.0",
  "dependencies": {
    "js-logger": "1.6.0",
    "node-fetch": "2.3.0",
    "url": "0.11.0"
  }
};
},{}],"tq6f":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bodyIsJson;

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
const jsonContentType = 'application/vnd.api+json';

function bodyIsJson(httpResponse) {
  const contentType = httpResponse.headers.get('content-type');
  return contentType && contentType.includes(jsonContentType);
}
},{}],"b1Oo":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reactorHeaders;

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
function reactorHeaders(accessToken) {
  return {
    Accept: 'application/vnd.api+json;revision=1',
    'Content-Type': 'application/vnd.api+json',
    'Cache-control': 'no-cache',
    Authorization: `Bearer ${accessToken}`,
    'X-Api-Key': 'Activation-DTM',
    'User-Agent': 'adobe-reactor-node'
  };
}
},{}],"52R6":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createReviseBody;

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
function createReviseBody(resourceType, resourceId) {
  return {
    data: {
      attributes: {},
      meta: {
        action: 'revise'
      },
      id: resourceId,
      type: resourceType
    }
  };
}
},{}],"EAMl":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAdapter = createAdapter;
exports.deleteAdapter = deleteAdapter;
exports.getAdapter = getAdapter;
exports.getPropertyForAdapter = getPropertyForAdapter;
exports.listAdaptersForProperty = listAdaptersForProperty;
exports.updateAdapter = updateAdapter;

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
// Adapters
// https://developer.adobelaunch.com/api/adapters/
// Create an Adapter
// https://developer.adobelaunch.com/api/adapters/create/
function createAdapter(propertyId, adapterSpec) {
  return this.post(`/properties/${propertyId}/adapters`, {
    data: adapterSpec
  });
} // Delete an Adapter
// https://developer.adobelaunch.com/api/adapters/delete/


function deleteAdapter(adapterId) {
  return this.delete(`/adapters/${adapterId}`);
} // Get an Adapter
// https://developer.adobelaunch.com/api/adapters/fetch/


function getAdapter(adapterId) {
  return this.get(`/adapters/${adapterId}`);
} // Get the Property for an Adapter
// https://developer.adobelaunch.com/api/adapters/property/


function getPropertyForAdapter(adapterId) {
  return this.get(`/adapters/${adapterId}/property`);
} // List Adapters for a Property
// https://developer.adobelaunch.com/api/adapters/list/


function listAdaptersForProperty(propertyId, queryParams) {
  return this.get(`/properties/${propertyId}/adapters`, queryParams);
} // Update an Adapter
// https://developer.adobelaunch.com/api/adapters/update/


function updateAdapter(adapterPatch) {
  return this.patch(`/adapters/${adapterPatch.id}`, {
    data: adapterPatch
  });
}
},{}],"8CJu":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAuditEvent = getAuditEvent;
exports.listAuditEvents = listAuditEvents;

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
// AuditEvents
// https://developer.adobelaunch.com/api/audit_events/
// Get an AuditEvent
// https://developer.adobelaunch.com/api/audit_events/show/
function getAuditEvent(auditEventId) {
  return this.get(`/audit_events/${auditEventId}`);
} // List AuditEvents
// https://developer.adobelaunch.com/api/audit_events/list/


function listAuditEvents(queryParams) {
  return this.get('/audit_events', queryParams);
}
},{}],"XCLB":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBuild = createBuild;
exports.getBuild = getBuild;
exports.listBuilds = listBuilds;

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
function createBuild(libraryId) {
  return this.post(`/libraries/${libraryId}/builds`);
}

function getBuild(buildId) {
  return this.get(`/builds/${buildId}`);
}

function listBuilds(libraryId, queryParams) {
  return this.get(`/libraries/${libraryId}/builds`, queryParams);
}
},{}],"JGFn":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCallback = createCallback;
exports.deleteCallback = deleteCallback;
exports.getCallback = getCallback;
exports.getPropertyForCallback = getPropertyForCallback;
exports.listCallbacksForProperty = listCallbacksForProperty;
exports.updateCallback = updateCallback;

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
// Callbacks
// https://developer.adobelaunch.com/api/callbacks
// Create a Callback
// https://developer.adobelaunch.com/api/callbacks/create/
function createCallback(propertyId, callback) {
  return this.post(`/properties/${propertyId}/callbacks`, {
    data: callback
  });
} // Delete a Callback
// https://developer.adobelaunch.com/api/callbacks/delete/


function deleteCallback(callbackId) {
  return this.delete(`/callbacks/${callbackId}`);
} // Get a Callback
// https://developer.adobelaunch.com/api/callbacks/fetch/


function getCallback(callbackId) {
  return this.get(`/callbacks/${callbackId}`);
} // Get the Property
// https://developer.adobelaunch.com/api/callbacks/property/


function getPropertyForCallback(callbackId) {
  return this.get(`/callbacks/${callbackId}/property`);
} // List Callbacks for a Property
// https://developer.adobelaunch.com/api/callbacks/list/


function listCallbacksForProperty(propertyId, queryParams) {
  return this.get(`/properties/${propertyId}/callbacks`, queryParams);
} // Update a Callback
// https://developer.adobelaunch.com/api/callbacks/update/


function updateCallback(callbackPatch) {
  return this.patch(`/callbacks/${callbackPatch.id}`, {
    data: callbackPatch
  });
}
},{}],"ZIHa":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCompany = getCompany;
exports.listCompanies = listCompanies;

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
function getCompany(companyId) {
  return this.get(`/companies/${companyId}`);
}

function listCompanies(queryParams) {
  return this.get('/companies', queryParams);
}
},{}],"n3Fq":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDataElement = createDataElement;
exports.deleteDataElement = deleteDataElement;
exports.getDataElement = getDataElement;
exports.getExtensionForDataElement = getExtensionForDataElement;
exports.getPropertyForDataElement = getPropertyForDataElement;
exports.getOriginForDataElement = getOriginForDataElement;
exports.listDataElementsForProperty = listDataElementsForProperty;
exports.listLibrariesForDataElement = listLibrariesForDataElement;
exports.listRevisionsForDataElement = listRevisionsForDataElement;
exports.reviseDataElement = reviseDataElement;
exports.updateDataElement = updateDataElement;

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
function createDataElement(propertyId, dataElement) {
  return this.post(`/properties/${propertyId}/data_elements`, {
    data: dataElement
  });
} // Delete a DataElement
// https://developer.adobelaunch.com/api/data_elements/delete/


function deleteDataElement(dataElementId) {
  return this.delete(`/data_elements/${dataElementId}`);
} // Get a DataElement
// https://developer.adobelaunch.com/api/data_elements/fetch/


function getDataElement(dataElementId) {
  return this.get(`/data_elements/${dataElementId}`);
} // Get the Extension
// https://developer.adobelaunch.com/api/data_elements/extension/


function getExtensionForDataElement(dataElementId) {
  return this.get(`/data_elements/${dataElementId}/extension`);
} // Get the Property
// https://developer.adobelaunch.com/api/data_elements/property/


function getPropertyForDataElement(dataElementId) {
  return this.get(`/data_elements/${dataElementId}/property`);
} // Get the origin
// https://developer.adobelaunch.com/api/data_elements/origin/


function getOriginForDataElement(dataElementId) {
  return this.get(`/data_elements/${dataElementId}/origin`);
} // List DataElements for a Property
// https://developer.adobelaunch.com/api/data_elements/list/


function listDataElementsForProperty(propertyId, queryParams) {
  return this.get(`/properties/${propertyId}/data_elements`, queryParams);
} // List the Libraries for a DataElement
// https://developer.adobelaunch.com/api/data_elements/libraries/


function listLibrariesForDataElement(dataElementId, queryParams) {
  return this.get(`/data_elements/${dataElementId}/libraries`, queryParams);
} // List the revisions for a DataElement
// https://developer.adobelaunch.com/api/data_elements/revisions/


function listRevisionsForDataElement(dataElementId) {
  return this.get(`/data_elements/${dataElementId}/revisions`);
} // Revise
// https://developer.adobelaunch.com/api/data_elements/revise/


function reviseDataElement(dataElementId) {
  return this.patch(`/data_elements/${dataElementId}`, this.createReviseBody('data_elements', dataElementId));
} // Update a DataElement
// https://developer.adobelaunch.com/api/data_elements/update/


function updateDataElement(dataElementPatch) {
  return this.patch(`/data_elements/${dataElementPatch.id}`, {
    data: dataElementPatch
  });
}
},{}],"uxiZ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEnvironment = createEnvironment;
exports.deleteEnvironment = deleteEnvironment;
exports.getEnvironment = getEnvironment;
exports.getAdapterForEnvironment = getAdapterForEnvironment;
exports.getAdapterRelationshipForEnvironment = getAdapterRelationshipForEnvironment;
exports.getLibraryForEnvironment = getLibraryForEnvironment;
exports.getPropertyForEnvironment = getPropertyForEnvironment;
exports.listBuildsForEnvironment = listBuildsForEnvironment;
exports.listEnvironmentsForProperty = listEnvironmentsForProperty;
exports.updateEnvironment = updateEnvironment;

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
// Environments
// https://developer.adobelaunch.com/api/environments
// Create an Environment
// https://developer.adobelaunch.com/api/environments/create/
function createEnvironment(propertyId, environment) {
  return this.post(`/properties/${propertyId}/environments`, {
    data: environment
  });
} // Delete an Environment
// https://developer.adobelaunch.com/api/environments/delete/


function deleteEnvironment(environmentId) {
  return this.delete(`/environments/${environmentId}`);
} // Get an Environment
// https://developer.adobelaunch.com/api/environments/fetch/


function getEnvironment(environmentId) {
  return this.get(`/environments/${environmentId}`);
} // Get the Adapter
// https://developer.adobelaunch.com/api/environments/adapter/


function getAdapterForEnvironment(environmentId) {
  return this.get(`/environments/${environmentId}/adapter`);
} // Get the Adapter relationship
// https://developer.adobelaunch.com/api/environments/adapter_relationship/


function getAdapterRelationshipForEnvironment(environmentId) {
  return this.get(`/environments/${environmentId}/relationships/adapter`);
} // Get the Library
// https://developer.adobelaunch.com/api/environments/fetch_library/


function getLibraryForEnvironment(environmentId) {
  return this.get(`/environments/${environmentId}/library`);
} // Get the Property
// https://developer.adobelaunch.com/api/environments/property/


function getPropertyForEnvironment(environmentId) {
  return this.get(`/environments/${environmentId}/property`);
} // List Builds
// https://developer.adobelaunch.com/api/environments/builds/


function listBuildsForEnvironment(propertyId, queryParams) {
  return this.get(`/properties/${propertyId}/builds`, queryParams);
} // List Environments for a Property
// https://developer.adobelaunch.com/api/environments/list/


function listEnvironmentsForProperty(propertyId, queryParams) {
  return this.get(`/properties/${propertyId}/environments`, queryParams);
} // Update an Environment
// https://developer.adobelaunch.com/api/environments/update/


function updateEnvironment(environmentPatch) {
  return this.patch(`/environments/${environmentPatch.id}`, {
    data: environmentPatch
  });
}
},{}],"TkgO":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExtensionPackage = createExtensionPackage;
exports.getExtensionPackage = getExtensionPackage;
exports.listExtensionPackages = listExtensionPackages;
exports.privateReleaseExtensionPackage = privateReleaseExtensionPackage;
exports.updateExtensionPackage = updateExtensionPackage;

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
function createExtensionPackage(zipFile) {
  return this.sendMultipartFile('POST', '/extension_packages', zipFile);
} // Get an ExtensionPackage
// https://developer.adobelaunch.com/api/extension_packages/fetch/


function getExtensionPackage(extensionPackageId) {
  return this.get(`/extension_packages/${extensionPackageId}`);
} // List ExtensionPackages
// https://developer.adobelaunch.com/api/extension_packages/list/


function listExtensionPackages(queryParams) {
  return this.get('/extension_packages', queryParams);
} // Private Release an ExtensionPackage
// https://developer.adobelaunch.com/api/extension_packages/release_private/


function privateReleaseExtensionPackage(extensionPackageId) {
  return this.patch(`/extension_packages/${extensionPackageId}`, {
    attributes: {},
    meta: {
      action: 'release_private'
    },
    id: extensionPackageId,
    type: 'extension_packages'
  });
} // Update an ExtensionPackage
// https://developer.adobelaunch.com/api/extension_packages/update/


function updateExtensionPackage(extensionPackageId, zipFile) {
  return this.sendMultipartFile('PATCH', `/extension_packages/${extensionPackageId}`, zipFile);
}
},{}],"/vco":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExtension = createExtension;
exports.deleteExtension = deleteExtension;
exports.getExtension = getExtension;
exports.getExtensionPackageForExtension = getExtensionPackageForExtension;
exports.getOriginForExtension = getOriginForExtension;
exports.getPropertyForExtension = getPropertyForExtension;
exports.listExtensionsForProperty = listExtensionsForProperty;
exports.listLibrariesForExtension = listLibrariesForExtension;
exports.listRevisionsForExtension = listRevisionsForExtension;
exports.reviseExtension = reviseExtension;
exports.updateExtension = updateExtension;

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
// Extensions
// https://developer.adobelaunch.com/api/reference/1.0/extensions/
// Create Extension
// https://developer.adobelaunch.com/api/reference/1.0/extensions/create/
function createExtension(propertyId, extension) {
  return this.post(`/properties/${propertyId}/extensions`, {
    data: extension
  });
} // Delete Extension
// https://developer.adobelaunch.com/api/reference/1.0/extensions/delete/


function deleteExtension(extensionId) {
  return this.delete(`/extensions/${extensionId}`);
} // Get Extension
// https://developer.adobelaunch.com/api/reference/1.0/extensions/fetch/


function getExtension(extensionId) {
  return this.get(`/extensions/${extensionId}`);
} // Get Extension's ExtensionPackage
// https://developer.adobelaunch.com/api/reference/1.0/extensions/extension_package/


function getExtensionPackageForExtension(extensionId) {
  return this.get(`/extensions/${extensionId}/extension_package`);
} // Get Extension's Origin
// https://developer.adobelaunch.com/api/reference/1.0/extensions/origin/


function getOriginForExtension(extensionId) {
  return this.get(`/extensions/${extensionId}/origin`);
} // Get Extension's Property
// https://developer.adobelaunch.com/api/reference/1.0/extensions/property/


function getPropertyForExtension(extensionId) {
  return this.get(`/extensions/${extensionId}/property`);
} // List Extensions
// https://developer.adobelaunch.com/api/reference/1.0/extensions/list/


function listExtensionsForProperty(propertyId, queryParams) {
  return this.get(`/properties/${propertyId}/extensions`, queryParams);
} // List Extension's Libraries
// https://developer.adobelaunch.com/api/reference/1.0/extensions/libraries/


function listLibrariesForExtension(extensionId) {
  return this.get(`/extensions/${extensionId}/libraries`);
} // List Extension's Revisions
// https://developer.adobelaunch.com/api/reference/1.0/extensions/revisions/


function listRevisionsForExtension(extensionId) {
  return this.get(`/extensions/${extensionId}/revisions`);
} // Revise Extension
// https://developer.adobelaunch.com/api/reference/1.0/extensions/revise/


function reviseExtension(extensionId) {
  return this.patch(`/extensions/${extensionId}`, this.createReviseBody('extensions', extensionId));
} // Update Extension
// https://developer.adobelaunch.com/api/reference/1.0/extensions/update/


function updateExtension(extensionId, extensionPatch) {
  return this.patch(`/extensions/${extensionId}`, extensionPatch);
}
},{}],"kfBa":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.heartbeat = heartbeat;

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
function heartbeat() {
  return this.get('/heartbeat');
}
},{}],"1pU4":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addResourceRelationshipsToLibrary = addResourceRelationshipsToLibrary;
exports.createLibrary = createLibrary;
exports.deleteLibrary = deleteLibrary;
exports.getLibrary = getLibrary;
exports.getEnvironmentForLibrary = getEnvironmentForLibrary;
exports.getEnvironmentRelationshipForLibrary = getEnvironmentRelationshipForLibrary;
exports.getPropertyForLibrary = getPropertyForLibrary;
exports.getUpstreamLibraryForLibrary = getUpstreamLibraryForLibrary;
exports.listLibrariesForProperty = listLibrariesForProperty;
exports.listResourceRelationshipsForLibrary = listResourceRelationshipsForLibrary;
exports.listResourcesForLibrary = listResourcesForLibrary;
exports.publishLibrary = publishLibrary;
exports.removeEnvironmentRelationshipFromLibrary = removeEnvironmentRelationshipFromLibrary;
exports.removeResourceRelationshipsFromLibrary = removeResourceRelationshipsFromLibrary;
exports.replaceResourceRelationshipsForLibrary = replaceResourceRelationshipsForLibrary;
exports.setEnvironmentRelationshipForLibrary = setEnvironmentRelationshipForLibrary;
exports.transitionLibrary = transitionLibrary;
exports.updateLibrary = updateLibrary;

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
// Libraries
// https://developer.adobelaunch.com/api/libraries
// Add resources to a Library
// https://developer.adobelaunch.com/api/libraries/add_resources/
function addResourceRelationshipsToLibrary(libraryId, postParams) {
  return this.post(`/libraries/${libraryId}/relationships/resources`, {
    data: postParams
  });
} // Create a Library
// https://developer.adobelaunch.com/api/libraries/create/


function createLibrary(propertyId, library) {
  return this.post(`/properties/${propertyId}/libraries`, {
    data: library
  });
} // Delete a Library


function deleteLibrary(libraryId) {
  return this.delete(`/libraries/${libraryId}`);
} // Get a Library
// https://developer.adobelaunch.com/api/libraries/fetch/


function getLibrary(libraryId) {
  return this.get(`/libraries/${libraryId}`);
} // Get the Environment
// https://developer.adobelaunch.com/api/libraries/fetch_environment/


function getEnvironmentForLibrary(libraryId) {
  return this.get(`/libraries/${libraryId}/environment`);
} // Get the Environment relationship
// https://developer.adobelaunch.com/api/libraries/fetch_environment_relationship/


function getEnvironmentRelationshipForLibrary(libraryId) {
  return this.get(`/libraries/${libraryId}/relationships/environment`);
} // Get the Property
// https://developer.adobelaunch.com/api/libraries/property/


function getPropertyForLibrary(libraryId) {
  return this.get(`/libraries/${libraryId}/property`);
} // Get the upstream Library
// https://developer.adobelaunch.com/api/libraries/upstream/


function getUpstreamLibraryForLibrary(libraryId) {
  return this.get(`/libraries/${libraryId}/upstream_library`);
} // List Libraries for a Property
// https://developer.adobelaunch.com/api/libraries/list/


function listLibrariesForProperty(propertyId, queryParams) {
  return this.get(`/properties/${propertyId}/libraries`, queryParams);
} // List resource relationships
// https://developer.adobelaunch.com/api/libraries/list_resource_relationships/


function listResourceRelationshipsForLibrary(libraryId, queryParams) {
  return this.get(`/libraries/${libraryId}/relationships/resources`, queryParams);
} // List resources
// https://developer.adobelaunch.com/api/libraries/resources/


function listResourcesForLibrary(libraryId, queryParams) {
  return this.get(`/libraries/${libraryId}/resources`, queryParams);
} // Publish a Library
// https://developer.adobelaunch.com/api/libraries/publish/


function publishLibrary(libraryId) {
  return this.post(`/libraries/${libraryId}/builds`);
} // Remove Environment relationship
// https://developer.adobelaunch.com/api/libraries/delete_environment_relationship/


function removeEnvironmentRelationshipFromLibrary(libraryId, environmentId) {
  return this.delete(`/libraries/${libraryId}/relationships/environment`, {
    data: {
      id: environmentId,
      type: 'environments'
    },
    id: libraryId
  });
} // Remove resource relationships
// https://developer.adobelaunch.com/api/libraries/remove_resource_relationships/


function removeResourceRelationshipsFromLibrary(libraryId, resources) {
  return this.delete(`/libraries/${libraryId}/relationships/resources`, {
    data: resources
  });
} // Replace resource relationships
// https://developer.adobelaunch.com/api/libraries/replace_resource_relationships/


function replaceResourceRelationshipsForLibrary(libraryId, resources) {
  return this.patch(`/libraries/${libraryId}/relationships/resources`, {
    data: resources
  });
} // Set Environment relationship for a Library
// https://developer.adobelaunch.com/api/libraries/set_environment_relationship/


function setEnvironmentRelationshipForLibrary(libraryId, environmentId) {
  checkLibraryId(libraryId);
  checkEnvironmentId(environmentId);
  return this.patch(`/libraries/${libraryId}/relationships/environment`, {
    data: {
      id: environmentId,
      type: 'environments'
    },
    id: libraryId
  });
} // Transition a Library
// https://developer.adobelaunch.com/api/libraries/transition/
// `action` must be 'submit', 'approve', 'reject', or 'develop'


function transitionLibrary(libraryId, action) {
  return this.patch(`/libraries/${libraryId}`, {
    data: {
      id: libraryId,
      type: 'libraries',
      meta: {
        action
      }
    }
  });
} // Update a Library
// https://developer.adobelaunch.com/api/libraries/update/


function updateLibrary(libraryPatch) {
  return this.patch(`/libraries/${libraryPatch.id}`, {
    data: libraryPatch
  });
}

function checkLibraryId(id) {
  if (!/^LB[0-9a-f]{32}$/.test(id)) throw `bad Library ID: ${id}`;
}

function checkEnvironmentId(id) {
  if (!/^EN[0-9a-f]{32}$/.test(id)) throw `bad Environment ID: ${id}`;
}
},{}],"dcW0":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProfile = getProfile;

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
function getProfile() {
  return this.get('/profile');
}
},{}],"DrK5":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createProperty = createProperty;
exports.getProperty = getProperty;
exports.getCompanyForProperty = getCompanyForProperty;
exports.listProperties = listProperties;
exports.updateProperty = updateProperty;
exports.deleteProperty = deleteProperty;

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
function createProperty(companyId, property) {
  return this.post(`/companies/${companyId}/properties`, {
    data: property
  });
}

function getProperty(propertyId) {
  return this.get(`/properties/${propertyId}`);
}

function getCompanyForProperty(propertyId) {
  return this.get(`/properties/${propertyId}/company`);
}

function listProperties(companyId, queryParams) {
  return this.get(`/companies/${companyId}/properties`, queryParams);
}

function updateProperty(propertyPatch) {
  return this.patch(`/properties/${propertyPatch.id}`, {
    data: propertyPatch
  });
}

function deleteProperty(propertyId) {
  return this.delete(`/properties/${propertyId}`);
}
},{}],"txjN":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRuleComponent = createRuleComponent;
exports.deleteRuleComponent = deleteRuleComponent;
exports.getRuleComponent = getRuleComponent;
exports.getExtensionForRuleComponent = getExtensionForRuleComponent;
exports.getRuleForRuleComponent = getRuleForRuleComponent;
exports.getOriginForRuleComponent = getOriginForRuleComponent;
exports.listRuleComponentsForRule = listRuleComponentsForRule;
exports.updateRuleComponent = updateRuleComponent;

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
// RuleComponents
// https://developer.adobelaunch.com/api/rule_components
//  Create a RuleComponent
// https://developer.adobelaunch.com/api/rule_components/create/
function createRuleComponent(ruleId, ruleComponent) {
  return this.post(`/rules/${ruleId}/rule_components`, {
    data: ruleComponent
  });
} //  Delete a RuleComponent
// https://developer.adobelaunch.com/api/rule_components/delete/


function deleteRuleComponent(ruleComponentId) {
  return this.delete(`/rule_components/${ruleComponentId}`);
} // Get a RuleComponent
// https://developer.adobelaunch.com/api/rule_components/fetch/


function getRuleComponent(ruleComponentId) {
  return this.get(`/rule_components/${ruleComponentId}`);
} // Get the Extension
// https://developer.adobelaunch.com/api/rule_components/extension/


function getExtensionForRuleComponent(ruleComponentId) {
  return this.get(`/rule_components/${ruleComponentId}/extension`);
} // Get the Rule
// https://developer.adobelaunch.com/api/rule_components/rule/


function getRuleForRuleComponent(ruleComponentId) {
  return this.get(`/rule_components/${ruleComponentId}/rule`);
} // Get the origin
// https://developer.adobelaunch.com/api/rule_components/origin/


function getOriginForRuleComponent(ruleComponentId) {
  return this.get(`/rule_components/${ruleComponentId}/origin`);
} // List RuleComponents for a Rule
// https://developer.adobelaunch.com/api/rule_components/list/


function listRuleComponentsForRule(ruleId, queryParams) {
  return this.get(`/rules/${ruleId}/rule_components`, queryParams);
} // Update a RuleComponent
// https://developer.adobelaunch.com/api/rule_components/update/


function updateRuleComponent(ruleComponentPatch) {
  return this.patch(`/rule_components/${ruleComponentPatch.id}`, {
    data: ruleComponentPatch
  });
}
},{}],"ZSE7":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRule = createRule;
exports.deleteRule = deleteRule;
exports.getRule = getRule;
exports.getPropertyForRule = getPropertyForRule;
exports.listLibrariesForRule = listLibrariesForRule;
exports.listRulesForBuild = listRulesForBuild;
exports.listRulesForProperty = listRulesForProperty;
exports.listRevisionsForRule = listRevisionsForRule;
exports.reviseRule = reviseRule;
exports.getOriginForRule = getOriginForRule;
exports.updateRule = updateRule;

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
// Rules
// https://developer.adobelaunch.com/api/rules
//
// Create a Rule
// https://developer.adobelaunch.com/api/rules/create/
function createRule(propertyId, rule) {
  return this.post(`/properties/${propertyId}/rules`, {
    data: rule
  });
} // Delete a Rule
// https://developer.adobelaunch.com/api/rules/delete/


function deleteRule(ruleId) {
  return this.delete(`/rules/${ruleId}`);
} // Get a Rule
// https://developer.adobelaunch.com/api/rules/fetch/


function getRule(ruleId) {
  return this.get(`/rules/${ruleId}`);
} // Get the Property
// https://developer.adobelaunch.com/api/rules/property/


function getPropertyForRule(ruleId) {
  return this.get(`/rules/${ruleId}/property`);
} // List Libraries
// https://developer.adobelaunch.com/api/rules/libraries/


function listLibrariesForRule(ruleId, queryParams) {
  return this.get(`/rules/${ruleId}/libraries`, queryParams);
} // List Rules for Build
// https://developer.adobelaunch.com/api/builds/rules/


function listRulesForBuild(buildId, queryParams) {
  return this.get(`/builds/${buildId}/rules`, queryParams);
} // List Rules for Property
// https://developer.adobelaunch.com/api/rules/list/


function listRulesForProperty(propertyId, queryParams) {
  return this.get(`/properties/${propertyId}/rules`, queryParams);
} // List revisions
// https://developer.adobelaunch.com/api/rules/revisions/


function listRevisionsForRule(ruleId) {
  return this.get(`/rules/${ruleId}/revisions`);
} // Revise a Rule
// https://developer.adobelaunch.com/api/rules/revise/


function reviseRule(ruleId) {
  return this.patch(`/rules/${ruleId}`, this.createReviseBody('rules', ruleId));
} // Get origin for Rule
// https://developer.adobelaunch.com/api/rules/origin/


function getOriginForRule(ruleId) {
  return this.get(`/rules/${ruleId}/origin`);
} // Update a Rule
// https://developer.adobelaunch.com/api/rules/update/


function updateRule(rulePatch) {
  return this.patch(`/rules/${rulePatch.id}`, {
    data: rulePatch
  });
}
},{}],"QZzC":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _url = _interopRequireDefault(require("url"));

var _bodyIsJson = _interopRequireDefault(require("./bodyIsJson"));

var _reactorHeaders = _interopRequireDefault(require("./reactorHeaders"));

var _createReviseBody = _interopRequireDefault(require("./createReviseBody"));

var adapters = _interopRequireWildcard(require("./adapters"));

var auditEvents = _interopRequireWildcard(require("./auditEvents"));

var builds = _interopRequireWildcard(require("./builds"));

var callbacks = _interopRequireWildcard(require("./callbacks"));

var companies = _interopRequireWildcard(require("./companies"));

var dataElements = _interopRequireWildcard(require("./dataElements"));

var environments = _interopRequireWildcard(require("./environments"));

var extensionPackages = _interopRequireWildcard(require("./extensionPackages"));

var extensions = _interopRequireWildcard(require("./extensions"));

var heartbeat = _interopRequireWildcard(require("./heartbeat"));

var libraries = _interopRequireWildcard(require("./libraries"));

var profiles = _interopRequireWildcard(require("./profiles"));

var properties = _interopRequireWildcard(require("./properties"));

var ruleComponents = _interopRequireWildcard(require("./ruleComponents"));

var rules = _interopRequireWildcard(require("./rules"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
class NullLogger {
  fatal() {}

  error() {}

  warn() {}

  info() {}

  debug() {}

  trace() {}

}

class Reactor {
  constructor(accessToken, options = {}) {
    const url = options.reactorUrl || 'https://reactor.adobe.io';
    this.baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    this.headers = (0, _reactorHeaders.default)(accessToken);
    this.logger = options.logger || new NullLogger();
    this.createReviseBody = _createReviseBody.default;
  }

  async request(method, url, requestData = null) {
    const requestBodyJson = requestData && JSON.stringify(requestData);
    const requestInfo = {
      method: method,
      headers: this.headers,
      body: requestBodyJson
    };
    const response = await (0, _nodeFetch.default)(url.toString(), requestInfo);
    const responseData = (0, _bodyIsJson.default)(response) ? await response.json() : null;
    const status = `${response.status} ${response.statusText}`;
    const source = `${method} ${url.toString()}`;

    if (!response.ok) {
      this.logger.warn(status, '<-', source, response);
    } else {
      this.logger.debug(status, '<-', source);
    }

    this.logger.trace('request headers =', requestInfo.headers, ', request body =', requestData, '; response headers =', response.headers, ', response body =', responseData);

    if (!response.ok) {
      throw new FetchError(method, url, requestInfo.headers, requestData, response, responseData);
    }

    return responseData;
  }

  async sendMultipartFile(method, url, fileObject) {
    const requestBodyJson = requestData && JSON.stringify(requestData);
    const requestInfo = {
      method: method,
      headers: Object.assign({}, this.headers, {
        'Content-Type': 'multipart/form-data'
      }),
      body: fileObject
    };
    this.logger.debug(method, url.toString());
    this.logger.trace('request headers:', requestInfo.headers);
    this.logger.trace('request body:', fileObject);
    const response = await (0, _nodeFetch.default)(url.toString(), requestInfo);
    const responseData = (0, _bodyIsJson.default)(response) ? await response.json() : null;
    const status = `${response.status} ${response.statusText}`;
    const source = `${method} ${url.toString()}`;

    if (responseData && !response.ok) {
      this.logger.warn(status, '<-', source, response);
      throw new FetchError(method, url, requestInfo.headers, requestData, response, responseData);
    } else {
      this.logger.debug(status, '<-', source);
    }

    this.logger.trace('response headers:', response.headers);
    this.logger.trace('response body:', responseData);
    return responseData;
  }

  get(path, queryParams = {}) {
    let U = URL;
    if (typeof U !== 'function') U = _url.default.URL;
    if (typeof U !== 'function') U = _url.default.Url;
    const url = new U(this.baseUrl + path);
    Object.entries(queryParams).forEach(([key, val]) => url.searchParams.append(key, val));
    return this.request('GET', url);
  }

  post(path, data) {
    return this.request('POST', this.baseUrl + path, data);
  }

  patch(path, data) {
    return this.request('PATCH', this.baseUrl + path, data);
  }

  delete(path, data) {
    return this.request('DELETE', this.baseUrl + path, data);
  }

}

exports.default = Reactor;

class FetchError extends Error {
  constructor(method, url, requestHeaders, requestData, response, responseBody) {
    const status = `${response.status} "${response.statusText}"`;
    const errorList = responseBody.errors || [];
    const details = [response, ...errorList].map(x => x.detail).filter(x => typeof x !== 'undefined').map(x => `'${x}'`).join('; also, ');
    const detail = details !== '' ? ` (${details})` : '';
    const whence = ` on ${method} ${url}`;
    super(status + detail + whence);
    if (Error.captureStackTrace) Error.captureStackTrace(this, FetchError);
    this.status = response.status;
    this.statusText = response.statusText;
    this.fetchDetails = {
      method: method,
      url: url,
      requestHeaders: requestHeaders,
      requestBody: requestData,
      response: response,
      responseBody: responseBody
    };
  }

}

Object.assign(Reactor.prototype, adapters, auditEvents, builds, callbacks, companies, dataElements, environments, extensionPackages, extensions, heartbeat, libraries, profiles, properties, ruleComponents, rules);
},{"./bodyIsJson":"tq6f","./reactorHeaders":"b1Oo","./createReviseBody":"52R6","./adapters":"EAMl","./auditEvents":"8CJu","./builds":"XCLB","./callbacks":"JGFn","./companies":"ZIHa","./dataElements":"n3Fq","./environments":"uxiZ","./extensionPackages":"TkgO","./extensions":"/vco","./heartbeat":"kfBa","./libraries":"1pU4","./profiles":"dcW0","./properties":"DrK5","./ruleComponents":"txjN","./rules":"ZSE7"}],"B3zm":[function(require,module,exports) {
"use strict";

var _nock = _interopRequireDefault(require("nock"));

var _reactorHeaders = _interopRequireDefault(require("../../../lib/reactorHeaders"));

var _jsLogger = _interopRequireDefault(require("js-logger"));

var _reactor = _interopRequireDefault(require("../../../lib/reactor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
function getEnv(varName, defaultValue) {
  return process.env[varName] || defaultValue;
}

const accessToken = 'No real token needed here because Launch calls are mocked';
const reactorUrl = 'https://reactor.sample.com';
const reqheaders = (0, _reactorHeaders.default)(accessToken);
const loggerLevel = getEnv('JASMINE_DEBUG_LEVEL', 'error');

_jsLogger.default.useDefaults();

const logger = _jsLogger.default.get('ReactorSDK');

const jsLoggerLevels = {
  error: _jsLogger.default.ERROR,
  info: _jsLogger.default.INFO,
  debug: _jsLogger.default.DEBUG,
  trace: _jsLogger.default.TRACE
};
logger.setLevel(jsLoggerLevels[loggerLevel]);

function expectRequest(method, path, body) {
  const initializedNock = (0, _nock.default)(reactorUrl, {
    reqheaders: reqheaders
  });
  const args = [path];

  if (typeof body !== 'undefined') {
    body = typeof body.data === 'undefined' ? {
      data: body
    } : body;
    args.push(body);
  }

  initializedNock[method.toLowerCase()].apply(initializedNock, args).reply(200);
}

jasmine.getEnv().reactorContext = {
  reactorUrl: reactorUrl,
  accessToken: accessToken,
  reqheaders: reqheaders,
  reactor: new _reactor.default(accessToken, {
    reactorUrl: reactorUrl,
    logger: logger
  }),
  expectRequest: expectRequest
};
},{"../../../lib/reactorHeaders":"b1Oo","../../../lib/reactor":"QZzC"}],"ouSA":[function(require,module,exports) {
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
describe('Adapter:', function () {
  const context = jasmine.getEnv().reactorContext;
  const reactor = context.reactor;
  const propertyId = 'CO123';
  const adapterId = 'AD123';
  describe('createAdapter', function () {
    it('runs an http POST', async function () {
      const adapter = {
        attributes: {
          name: `Awesome Adapter ${new Date().getTime()}`,
          type_of: 'sftp'
        },
        type: 'adapters'
      };
      context.expectRequest('post', `/properties/${propertyId}/adapters`, adapter);
      await reactor.createAdapter(propertyId, adapter);
    });
  });
  describe('listAdaptersForProperty', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', `/properties/${propertyId}/adapters`);
      await reactor.listAdaptersForProperty(propertyId);
    });
    it('runs an http GET with query parameters', async function () {
      context.expectRequest('get', `/properties/${propertyId}/adapters?filter%5Bname%5D=EQ+Delta%2CEQ+Bravo&sort=-name`);
      await reactor.listAdaptersForProperty(propertyId, {
        'filter[name]': 'EQ Delta,EQ Bravo',
        sort: '-name'
      });
    });
  });
  describe('getAdapter', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', `/adapters/${adapterId}`);
      await reactor.getAdapter(adapterId);
    });
  });
  describe('updateAdapter', function () {
    it('runs an http PATCH', async function () {
      const adapterPatch = {
        id: adapterId,
        attributes: {
          name: `Updated Adapter ${new Date().getTime()}`
        },
        type: 'adapters'
      };
      context.expectRequest('patch', `/adapters/${adapterId}`, adapterPatch);
      await reactor.updateAdapter(adapterPatch);
    });
  });
  describe('deleteAdapter', function () {
    it('runs an http DELETE', async function () {
      context.expectRequest('delete', `/adapters/${adapterId}`);
      await reactor.deleteAdapter(adapterId);
    });
  });
});
},{}],"hMA5":[function(require,module,exports) {
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
describe('AuditEvent:', function () {
  const context = jasmine.getEnv().reactorContext;
  const reactor = context.reactor;
  const auditEventId = 'AE123';
  describe('listAuditEvents', function () {
    it('list', async function () {
      context.expectRequest('get', '/audit_events');
      await reactor.listAuditEvents();
    });
  });
  describe('listAuditEvents', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', '/audit_events?filter%5Bname%5D=EQ+Delta%2CEQ+Bravo&sort=-name');
      await reactor.listAuditEvents({
        'filter[name]': 'EQ Delta,EQ Bravo',
        sort: '-name'
      });
    });
  });
  describe('getAuditEvent', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', `/audit_events/${auditEventId}`);
      await reactor.getAuditEvent(auditEventId);
    });
  });
});
},{}],"C+zT":[function(require,module,exports) {
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
describe('Build:', function () {
  const context = jasmine.getEnv().reactorContext;
  const reactor = context.reactor;
  const libraryId = 'LB00000000000000000000000000000000';
  const buildId = 'PR00000000000000000000000000000000';
  describe('createBuild', function () {
    it('runs an http POST', async function () {
      context.expectRequest('post', `/libraries/${libraryId}/builds`);
      await reactor.createBuild(libraryId);
    });
  });
  describe('listBuilds', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', `/libraries/${libraryId}/builds`);
      await reactor.listBuilds(libraryId);
    });
    it('runs an http GET with query parameters', async function () {
      context.expectRequest('get', `/libraries/${libraryId}/builds?filter%5Bname%5D=EQ+Delta%2CEQ+Bravo&sort=-name`);
      await reactor.listBuilds(libraryId, {
        'filter[name]': 'EQ Delta,EQ Bravo',
        sort: '-name'
      });
    });
  });
  describe('getBuild', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', `/builds/${buildId}`);
      await reactor.getBuild(buildId);
    });
  });
});
},{}],"d2x8":[function(require,module,exports) {
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
describe('Callback:', function () {
  const context = jasmine.getEnv().reactorContext;
  const reactor = context.reactor;
  const propertyId = 'PR123';
  const callbackId = 'CB123';
  describe('createCallback', function () {
    it('runs an http POST', async function () {
      const callback = {
        attributes: {
          url: 'https://www.example.com',
          subscriptions: ['rule.created']
        }
      };
      context.expectRequest('post', `/properties/${propertyId}/callbacks`, callback);
      await reactor.createCallback(propertyId, callback);
    });
  });
  describe('listCallbacksForProperty', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', `/properties/${propertyId}/callbacks`);
      await reactor.listCallbacksForProperty(propertyId);
    });
    it('runs an http GET with query parameters', async function () {
      context.expectRequest('get', `/properties/${propertyId}/callbacks?filter%5Bname%5D=EQ+Delta%2CEQ+Bravo&sort=-name`);
      await reactor.listCallbacksForProperty(propertyId, {
        'filter[name]': 'EQ Delta,EQ Bravo',
        sort: '-name'
      });
    });
  });
  describe('getCallback', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', `/callbacks/${callbackId}`);
      await reactor.getCallback(callbackId);
    });
  });
  describe('updateCallback', function () {
    it('runs an http PATCH', async function () {
      const callbackPatch = {
        attributes: {
          url: 'https://www.example.net',
          subscriptions: ['rule.created', 'build.created']
        },
        id: callbackId,
        type: 'callbacks'
      };
      context.expectRequest('patch', `/callbacks/${callbackId}`, callbackPatch);
      await reactor.updateCallback(callbackPatch);
    });
  });
  describe('deleteCallback', function () {
    it('runs an http DELETE', async function () {
      context.expectRequest('delete', `/callbacks/${callbackId}`);
      await reactor.deleteCallback(callbackId);
    });
  });
});
},{}],"yMxa":[function(require,module,exports) {
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
describe('Company:', function () {
  const context = jasmine.getEnv().reactorContext;
  const reactor = context.reactor;
  const companyId = 'CO123';
  describe('listCompanies', function () {
    it('list', async function () {
      context.expectRequest('get', '/companies');
      await reactor.listCompanies();
    });
  });
  describe('listCompanies', function () {
    it('list with query parameters', async function () {
      context.expectRequest('get', '/companies?filter%5Bname%5D=EQ+Delta%2CEQ+Bravo&sort=-name');
      await reactor.listCompanies({
        'filter[name]': 'EQ Delta,EQ Bravo',
        sort: '-name'
      });
    });
  });
  describe('getCompany', function () {
    it('get', async function () {
      context.expectRequest('get', `/companies/${companyId}`);
      await reactor.getCompany(companyId);
    });
  });
});
},{}],"vCJa":[function(require,module,exports) {
"use strict";

var _createReviseBody = _interopRequireDefault(require("../../lib/createReviseBody"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
describe('DataElement:', function () {
  const context = jasmine.getEnv().reactorContext;
  const reactor = context.reactor;
  const propertyId = 'PR123';
  const dataElementId = 'DE123';
  describe('createDataElement', function () {
    it('runs an http POST', async function () {
      const dataElement = {
        attributes: {
          name: `Data Element ${new Date().getTime()}`
        },
        type: 'data_elements'
      };
      context.expectRequest('post', `/properties/${propertyId}/data_elements`, dataElement);
      await reactor.createDataElement(propertyId, dataElement);
    });
  });
  describe('updateElement', function () {
    it('runs an http PATCH', async function () {
      const dataElementPatch = {
        id: dataElementId,
        attributes: {
          name: `Updated DataElement ${new Date().getTime()}`
        },
        type: 'data_elements'
      };
      context.expectRequest('patch', `/data_elements/${dataElementId}`, dataElementPatch);
      await reactor.updateDataElement(dataElementPatch);
    });
  });
  describe('reviseDataElement', function () {
    it('runs an http PATCH', async function () {
      const reviseBody = (0, _createReviseBody.default)('data_elements', dataElementId);
      context.expectRequest('patch', `/data_elements/${dataElementId}`, reviseBody);
      await reactor.reviseDataElement(dataElementId);
    });
  });
  describe('getDataElement', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', `/data_elements/${dataElementId}`);
      await reactor.getDataElement(dataElementId);
    });
  });
  describe('listRevisionsForDataElement', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', `/data_elements/${dataElementId}/revisions`);
      await reactor.listRevisionsForDataElement(dataElementId);
    });
  });
  describe('listDataElementsForProperty', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', `/properties/${propertyId}/data_elements`);
      await reactor.listDataElementsForProperty(propertyId);
    });
    it('runs an http GET with query parameters', async function () {
      context.expectRequest('get', `/properties/${propertyId}/data_elements?filter%5Bname%5D=EQ+Delta%2CEQ+Bravo&sort=-name`);
      await reactor.listDataElementsForProperty(propertyId, {
        'filter[name]': 'EQ Delta,EQ Bravo',
        sort: '-name'
      });
    });
  });
  describe('deleteDataElement', function () {
    it('runs an http DELETE', async function () {
      context.expectRequest('delete', `/data_elements/${dataElementId}`);
      await reactor.deleteDataElement(dataElementId);
    });
  });
});
},{"../../lib/createReviseBody":"52R6"}],"vdQw":[function(require,module,exports) {
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
describe('Environment:', function () {
  const context = jasmine.getEnv().reactorContext;
  const reactor = context.reactor;
  const propertyId = 'PR00000000000000000000000000000000';
  const environmentId = 'EN00000000000000000000000000000000';
  describe('createEnvironment', function () {
    it('runs an http POST', async function () {
      const environment = {
        attributes: {
          name: `Environment ${new Date().getTime()}`
        },
        type: 'environments'
      };
      context.expectRequest('post', `/properties/${propertyId}/environments`, environment);
      await reactor.createEnvironment(propertyId, environment);
    });
  });
  describe('updateEnvironment', function () {
    it('runs an http PATCH', async function () {
      const environmentPatch = {
        id: environmentId,
        attributes: {
          name: `Updated Environment ${new Date().getTime()}`
        },
        type: 'environments'
      };
      context.expectRequest('patch', `/environments/${environmentId}`, environmentPatch);
      await reactor.updateEnvironment(environmentPatch);
    });
  });
  describe('getEnvironment', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', `/environments/${environmentId}`);
      await reactor.getEnvironment(environmentId);
    });
  });
  describe('listEnvironmentsForProperty', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', `/properties/${propertyId}/environments`);
      await reactor.listEnvironmentsForProperty(propertyId);
    });
    it('runs an http GET with query parameters', async function () {
      context.expectRequest('get', `/properties/${propertyId}/environments?filter%5Bname%5D=EQ+Delta%2CEQ+Bravo&sort=-name`);
      await reactor.listEnvironmentsForProperty(propertyId, {
        'filter[name]': 'EQ Delta,EQ Bravo',
        sort: '-name'
      });
    });
  });
  describe('deleteEnvironment', function () {
    it('runs an http DELETE', async function () {
      context.expectRequest('delete', `/environments/${environmentId}`);
      await reactor.deleteEnvironment(environmentId);
    });
  });
});
},{}],"qF1X":[function(require,module,exports) {
"use strict";

var _createReviseBody = _interopRequireDefault(require("../../lib/createReviseBody"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
describe('Extension:', function () {
  const context = jasmine.getEnv().reactorContext;
  const reactor = context.reactor;
  const propertyId = 'PR123';
  const extensionId = 'EX123';
  describe('createExtension', function () {
    it('runs an http POST', async function () {
      const extension = {
        attributes: {
          enabled: true
        },
        type: 'extensions'
      };
      context.expectRequest('post', `/properties/${propertyId}/extensions`, extension);
      await reactor.createExtension(propertyId, extension);
    });
  });
  describe('updateExtension', function () {
    it('runs an http PATCH', async function () {
      const patch = {
        data: {
          id: extensionId,
          attributes: {
            enabled: false
          },
          type: 'extensions'
        }
      };
      context.expectRequest('patch', `/extensions/${extensionId}`, patch);
      await reactor.updateExtension(extensionId, patch);
    });
  });
  describe('reviseExtension', function () {
    it('runs an http PATCH', async function () {
      const reviseBody = (0, _createReviseBody.default)('extensions', extensionId);
      context.expectRequest('patch', `/extensions/${extensionId}`, reviseBody);
      await reactor.reviseExtension(extensionId);
    });
  });
  describe('getExtension', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', `/extensions/${extensionId}`);
      await reactor.getExtension(extensionId);
    });
  });
  describe('listRevisionsForExtension', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', `/extensions/${extensionId}/revisions`);
      await reactor.listRevisionsForExtension(extensionId);
    });
  });
  describe('listExtensionsForProperty', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', `/properties/${propertyId}/extensions`);
      await reactor.listExtensionsForProperty(propertyId);
    });
    it('runs an http GET with query parameters', async function () {
      context.expectRequest('get', `/properties/${propertyId}/extensions?filter%5Bname%5D=EQ+Delta%2CEQ+Bravo&sort=-name`);
      await reactor.listExtensionsForProperty(propertyId, {
        'filter[name]': 'EQ Delta,EQ Bravo',
        sort: '-name'
      });
    });
  });
  describe('deleteExtension', function () {
    it('runs an http DELETE', async function () {
      context.expectRequest('delete', `/extensions/${extensionId}`);
      await reactor.deleteExtension(extensionId);
    });
  });
});
},{"../../lib/createReviseBody":"52R6"}],"MAT4":[function(require,module,exports) {
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
describe('ExtensionPackage:', function () {
  const context = jasmine.getEnv().reactorContext;
  const reactor = context.reactor;
  const extensionPackageId = 'EP123';
  describe('getExtensionPackage', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', `/extension_packages/${extensionPackageId}`);
      await reactor.getExtensionPackage(extensionPackageId);
    });
  });
  describe('listExtensionPackages', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', '/extension_packages');
      await reactor.listExtensionPackages();
    });
    it('runs an http GET with query parameters', async function () {
      context.expectRequest('get', '/extension_packages?filter%5Bname%5D=EQ+Delta%2CEQ+Bravo&sort=-name');
      await reactor.listExtensionPackages({
        'filter[name]': 'EQ Delta,EQ Bravo',
        sort: '-name'
      });
    });
  });
});
},{}],"l8Qs":[function(require,module,exports) {
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
describe('Heartbeat:', function () {
  const context = jasmine.getEnv().reactorContext;
  const reactor = context.reactor;
  it('runs an http GET', async function () {
    context.expectRequest('get', '/heartbeat');
    await reactor.heartbeat();
  });
});
},{}],"nO0v":[function(require,module,exports) {
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
describe('Library:', function () {
  const context = jasmine.getEnv().reactorContext;
  const reactor = context.reactor;
  const propertyId = 'PR00000000000000000000000000000000';
  const libraryId = 'LB12341234123412341234123412341234';
  describe('createLibrary', function () {
    it('runs an http POST', async function () {
      const library = {
        attributes: {
          name: `Awesome Library ${new Date().getTime()}`
        },
        type: 'libraries'
      };
      context.expectRequest('post', `/properties/${propertyId}/libraries`, library);
      await reactor.createLibrary(propertyId, library);
    });
  });
  describe('updateLibrary', function () {
    it('runs an http PATCH', async function () {
      const libraryPatch = {
        id: libraryId,
        attributes: {
          name: `Awesome Library ${new Date().getTime()}`
        },
        type: 'libraries'
      };
      context.expectRequest('patch', `/libraries/${libraryId}`, libraryPatch);
      await reactor.updateLibrary(libraryPatch);
    });
  });
  describe('getLibrary', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', `/libraries/${libraryId}`);
      await reactor.getLibrary(libraryId);
    });
  });
  describe('listLibrariesForProperty', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', `/properties/${propertyId}/libraries`);
      await reactor.listLibrariesForProperty(propertyId);
    });
    it('runs an http GET with query parameters', async function () {
      context.expectRequest('get', `/properties/${propertyId}/libraries?filter%5Bname%5D=EQ+Delta%2CEQ+Bravo&sort=-name`);
      await reactor.listLibrariesForProperty(propertyId, {
        'filter[name]': 'EQ Delta,EQ Bravo',
        sort: '-name'
      });
    });
  });
  describe('deleteLibrary', function () {
    it('runs an http DELETE', async function () {
      context.expectRequest('delete', `/libraries/${libraryId}`);
      await reactor.deleteLibrary(libraryId);
    });
  });
  describe('transitionLibrary', function () {
    it('runs an http PATCH', async function () {
      const action = 'submit';
      const expectedBody = {
        data: {
          id: libraryId,
          type: 'libraries',
          meta: {
            action
          }
        }
      };
      context.expectRequest('patch', `/libraries/${libraryId}`, expectedBody);
      await reactor.transitionLibrary(libraryId, action);
    });
  });
  describe('setEnvironmentRelationshipForLibrary', function () {
    it('runs an http PATCH', async function () {
      const environmentId = 'EN00000000000000000000000000000000';
      const expectedBody = {
        data: {
          id: environmentId,
          type: 'environments'
        },
        id: libraryId
      };
      context.expectRequest('patch', `/libraries/${libraryId}/relationships/environment`, expectedBody);
      await reactor.setEnvironmentRelationshipForLibrary(libraryId, environmentId);
    });
  });
  describe('deleteLibraryEnvironmentRelationship', function () {
    it('runs an http DELETE', async function () {
      const environmentId = 'EN00000000000000000000000000000000';
      const expectedBody = {
        data: {
          id: environmentId,
          type: 'environments'
        },
        id: libraryId
      };
      context.expectRequest('delete', `/libraries/${libraryId}/relationships/environment`, expectedBody);
      await reactor.removeEnvironmentRelationshipFromLibrary(libraryId, environmentId);
    });
  });
});
},{}],"DmBY":[function(require,module,exports) {
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
describe('Profile:', function () {
  const context = jasmine.getEnv().reactorContext;
  const reactor = context.reactor;
  describe('getProfile', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', '/profile');
      await reactor.getProfile();
    });
  });
});
},{}],"xjTb":[function(require,module,exports) {
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
describe('Property:', function () {
  const context = jasmine.getEnv().reactorContext;
  const reactor = context.reactor;
  const companyId = 'CO123';
  const propertyId = 'PR123';
  describe('createProperty', function () {
    it('runs an http POST', async function () {
      const property = {
        attributes: {
          domains: ['adobe.com'],
          name: `Awesome Property ${new Date().getTime()}`,
          platform: 'web',
          type: 'properties'
        },
        type: 'properties'
      };
      context.expectRequest('post', `/companies/${companyId}/properties`, property);
      await reactor.createProperty(companyId, property);
    });
  });
  describe('listProperties', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', `/companies/${companyId}/properties`);
      await reactor.listProperties(companyId);
    });
    it('runs an http GET with query parameters', async function () {
      context.expectRequest('get', `/companies/${companyId}/properties?filter%5Bname%5D=EQ+Delta%2CEQ+Bravo&sort=-name`);
      await reactor.listProperties(companyId, {
        'filter[name]': 'EQ Delta,EQ Bravo',
        sort: '-name'
      });
    });
  });
  describe('getProperty', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', `/properties/${propertyId}`);
      await reactor.getProperty(propertyId);
    });
  });
  describe('updateProperty', function () {
    it('runs an http PATCH', async function () {
      const propertyPatch = {
        id: propertyId,
        attributes: {
          name: `Updated Property ${new Date().getTime()}`
        },
        type: 'properties'
      };
      context.expectRequest('patch', `/properties/${propertyId}`, propertyPatch);
      await reactor.updateProperty(propertyPatch);
    });
  });
  describe('deleteProperty', function () {
    it('runs an http DELETE', async function () {
      context.expectRequest('delete', `/properties/${propertyId}`);
      await reactor.deleteProperty(propertyId);
    });
  });
});
},{}],"ekgI":[function(require,module,exports) {
"use strict";

var _createReviseBody = _interopRequireDefault(require("../../lib/createReviseBody"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
describe('Rule:', function () {
  const context = jasmine.getEnv().reactorContext;
  const reactor = context.reactor;
  const propertyId = 'PR123';
  const ruleId = 'RL123';
  describe('createRule', function () {
    it('runs an http POST', async function () {
      const rule = {
        attributes: {
          name: `Rule ${new Date().getTime()}`
        },
        type: 'rules'
      };
      context.expectRequest('post', `/properties/${propertyId}/rules`, rule);
      await reactor.createRule(propertyId, rule);
    });
  });
  describe('updateRule', function () {
    it('runs an http PATCH', async function () {
      const rulePatch = {
        id: ruleId,
        attributes: {
          name: `Updated Rule ${new Date().getTime()}`
        },
        type: 'rules'
      };
      context.expectRequest('patch', `/rules/${ruleId}`, rulePatch);
      await reactor.updateRule(rulePatch);
    });
  });
  describe('reviseRule', function () {
    it('runs an http PATCH', async function () {
      const reviseBody = (0, _createReviseBody.default)('rules', ruleId);
      context.expectRequest('patch', `/rules/${ruleId}`, reviseBody);
      await reactor.reviseRule(ruleId);
    });
  });
  describe('listRevisionsForRule', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', `/rules/${ruleId}/revisions`);
      await reactor.listRevisionsForRule(ruleId);
    });
  });
  describe('getRule', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', `/rules/${ruleId}`);
      await reactor.getRule(ruleId);
    });
  });
  describe('listRulesForProperty', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', `/properties/${propertyId}/rules`);
      await reactor.listRulesForProperty(propertyId);
    });
    it('runs an http GET with query parameters', async function () {
      context.expectRequest('get', `/properties/${propertyId}/rules?filter%5Bname%5D=EQ+Delta%2CEQ+Bravo&sort=-name`);
      await reactor.listRulesForProperty(propertyId, {
        'filter[name]': 'EQ Delta,EQ Bravo',
        sort: '-name'
      });
    });
  });
  describe('deleteRule', function () {
    it('runs an http DELETE', async function () {
      context.expectRequest('delete', `/rules/${ruleId}`);
      await reactor.deleteRule(ruleId);
    });
  });
});
},{"../../lib/createReviseBody":"52R6"}],"ni0k":[function(require,module,exports) {
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
describe('RuleComponent:', function () {
  const context = jasmine.getEnv().reactorContext;
  const reactor = context.reactor;
  const ruleId = 'RL123';
  const ruleComponentId = 'RC123';
  describe('createRuleComponent', function () {
    it('runs an http POST', async function () {
      const ruleComponent = {
        attributes: {
          name: `RuleComponent ${new Date().getTime()}`
        },
        type: 'rule_components'
      };
      context.expectRequest('post', `/rules/${ruleId}/rule_components`, ruleComponent);
      await reactor.createRuleComponent(ruleId, ruleComponent);
    });
  });
  describe('updateRuleComponent', function () {
    it('runs an http PATCH', async function () {
      const ruleComponentPatch = {
        id: ruleComponentId,
        attributes: {
          name: `Updated RuleCompoment ${new Date().getTime()}`
        },
        type: 'rule_components'
      };
      context.expectRequest('patch', `/rule_components/${ruleComponentId}`, ruleComponentPatch);
      await reactor.updateRuleComponent(ruleComponentPatch);
    });
  });
  describe('getRuleComponent', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', `/rule_components/${ruleComponentId}`);
      await reactor.getRuleComponent(ruleComponentId);
    });
  });
  describe('listRuleComponentsForRule', function () {
    it('runs an http GET', async function () {
      context.expectRequest('get', `/rules/${ruleId}/rule_components`);
      await reactor.listRuleComponentsForRule(ruleId);
    });
    it('runs an http GET with query parameters', async function () {
      context.expectRequest('get', `/rules/${ruleId}/rule_components?filter%5Bname%5D=EQ+Delta%2CEQ+Bravo&sort=-name`);
      await reactor.listRuleComponentsForRule(ruleId, {
        'filter[name]': 'EQ Delta,EQ Bravo',
        sort: '-name'
      });
    });
  });
  describe('deleteRuleComponent', function () {
    it('runs an http DELETE', async function () {
      context.expectRequest('delete', `/rule_components/${ruleComponentId}`);
      await reactor.deleteRuleComponent(ruleComponentId);
    });
  });
});
},{}],"epB2":[function(require,module,exports) {
"use strict";

var _semver = _interopRequireDefault(require("semver"));

var _package = require("../../package");

var Reactor = _interopRequireWildcard(require("./../.."));

require("./helpers/envConfig.helper.js");

require("./adapter.test.js");

require("./auditEvent.test.js");

require("./build.test.js");

require("./callback.test.js");

require("./company.test.js");

require("./dataElement.test.js");

require("./environment.test.js");

require("./extension.test.js");

require("./extensionPackage.test.js");

require("./heartbeat.test.js");

require("./library.test.js");

require("./profile.test.js");

require("./property.test.js");

require("./rule.test.js");

require("./ruleComponent.test.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const version = _package.engines.node;

if (!_semver.default.satisfies(process.version, version)) {
  console.log(`Reactor SDK requires node version ${version},
which is not satisfied by your current version (${process.version}).`);
  process.exit(1);
}
},{"../../package":"OjAK","./../..":"QZzC","./helpers/envConfig.helper.js":"B3zm","./adapter.test.js":"ouSA","./auditEvent.test.js":"hMA5","./build.test.js":"C+zT","./callback.test.js":"d2x8","./company.test.js":"yMxa","./dataElement.test.js":"vCJa","./environment.test.js":"vdQw","./extension.test.js":"qF1X","./extensionPackage.test.js":"MAT4","./heartbeat.test.js":"l8Qs","./library.test.js":"nO0v","./profile.test.js":"DmBY","./property.test.js":"xjTb","./rule.test.js":"ekgI","./ruleComponent.test.js":"ni0k"}]},{},["epB2"], null)
//# sourceMappingURL=/unit-test-main.js.map