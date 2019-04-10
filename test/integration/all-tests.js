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

// Clean up any cobwebs from the last run of the integration tests
import helpers from './helpers';

// runs before all suites
beforeAll(async function() {
  console.group('Reactor JavaScript SDK Integration Tests');
  await helpers.cleanUpTestProperties();
});

// runs after all suites
afterAll(function() {
  console.groupEnd('Reactor JavaScript SDK Integration Tests');
});

// Metadata
import './heartbeat.test.js';
import './profile.test.js';

// Launch Types
import './adapters.test.js';
import './audit-events.test.js';
import './builds.test.js';
import './callbacks.test.js';
import './companies.test.js';
import './data-elements.test.js';
import './environments.test.js';
import './extension-packages.test.js';
import './extensions.test.js';
import './libraries.test.js';
import './properties.test.js';
import './rule-components.test.js';
import './rules.test.js';

// [Reactor Postman](https://github.com/Adobe-Marketing-Cloud/reactor-postman),
// re-imagined via the JavaScript SDK.
import './examples.test.js';
