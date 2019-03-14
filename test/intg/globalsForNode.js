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

// This package exports nothing.
// However, loading it has the side effect of copying environment variable
// values into jasmine.getEnv().reactorIntegrationTestGlobals.
//
// Tests intended to run in nodejs _could_ just access these values directly
// from `process.env`, but putting them in Jasmine's environment means that the
// same source code can be used for both the in-browser and in-Node tests.
let globals = jasmine.getEnv().reactorIntegrationTestGlobals;
if (!globals) {
  globals = {
    ORG_ID: process.env.ORG_ID,
    ACCESS_TOKEN: process.env.ACCESS_TOKEN,
    REACTOR_URL: process.env.REACTOR_URL,
    COMPANY_ID: process.env.COMPANY_ID,
    LOG_LEVEL: process.env.JASMINE_DEBUG_LEVEL || 'error'
  };
  jasmine.getEnv().reactorIntegrationTestGlobals = globals;
}
export { globals as default };
