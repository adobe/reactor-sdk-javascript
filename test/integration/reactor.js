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
import Reactor from '../../src/index.js';

var globals = jasmine.getEnv().reactorIntegrationTestGlobals;

var reactor = globals.reactor;
if (!reactor) {
  const options = { reactorUrl: globals.REACTOR_URL, enableLogging: true };

  reactor = new Reactor(globals.ACCESS_TOKEN, options);
  reactor.accessCode = globals.ACCESS_TOKEN;
  reactor.reactorUrl = globals.REACTOR_URL;
  reactor.myCompanyId = globals.COMPANY_ID;
  globals.reactor = reactor;
}

export { reactor as default };
