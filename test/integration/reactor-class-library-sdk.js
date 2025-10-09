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

/*
This package exports nothing. However, loading it has the side effect of loading
the Reactor class into `jasmine.getEnv().reactorIntegrationTestGlobals.Reactor`.
*/
import Reactor from '../../lib/node/index.js';

// Check if jasmine is available before using it
if (typeof jasmine !== 'undefined') {
  var globals = jasmine.getEnv().reactorIntegrationTestGlobals;
  if (globals) {
    globals.Reactor = Reactor;
  }
} else {
  // If jasmine is not available, we'll export Reactor directly
  if (typeof globalThis !== 'undefined') {
    globalThis.Reactor = Reactor;
  } else if (typeof global !== 'undefined') {
    global.Reactor = Reactor;
  }
}
