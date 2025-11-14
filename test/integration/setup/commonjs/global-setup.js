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

import dotenv from 'dotenv';
import path from 'path';
// commonjs version of Reactor
import Reactor from '../../../../lib/cjs/index.js';

// Load main .env (client id/secret etc)
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

// Now set up Jasmine globals
let globals = jasmine.getEnv().reactorIntegrationTestGlobals;
if (!globals) {
  globals = {
    ORG_ID: process.env.RSDK_ADOBE_ORG_ID,
    ACCESS_TOKEN: process.env.RSDK_ACCESS_TOKEN,
    REACTOR_URL: process.env.RSDK_ADOBE_REACTOR_URL,
    COMPANY_ID: process.env.RSDK_ADOBE_REACTOR_COMPANY_ID
  };
  jasmine.getEnv().reactorIntegrationTestGlobals = globals;
}

globals.Reactor = Reactor;
