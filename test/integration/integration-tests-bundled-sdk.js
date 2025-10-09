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

// This file is loaded by the HTML page and runs in the browser context.
// The HTML page loads:
// 1. jasmine.js - Sets up the Jasmine testing framework
// 2. jasmine-html.js - Sets up Jasmine HTML reporter
// 3. boot.js - Initializes Jasmine
// 4. This file (integration-tests-bundled-sdk.js) - Runs the tests
//
// The globals-for-browser.js file will be loaded by Parcel bundling and
// will set up jasmine.getEnv().reactorIntegrationTestGlobals
//
// The reactor-class-bundled-sdk.js will be loaded by Parcel bundling and
// will set up jasmine.getEnv().reactorIntegrationTestGlobals.Reactor
//
// The all-tests.js file will be loaded by Parcel bundling and
// contains all the integration test specifications

console.log('Browser integration tests loaded - bundled SDK version');
