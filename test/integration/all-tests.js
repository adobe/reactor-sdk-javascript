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

// As soon as a test fails, log its details to the console.
// When Jasmine first detects a failure, its standard reporter only shows a red
// X; the details are not shown until all tests have completed.  This code logs
// the failure details to the console immediately, so you can start working on
// debugging early failures while the rest of the tests run.
var consoleReporter = {
  specDone: function(result) {
    var passedCount = result.passedExpectations.length;
    var failedCount = result.failedExpectations.length;
    if (failedCount === 0) return;
    console.error(
      `Spec ${result.status}: "${result.description}";`,
      `tests passed: ${passedCount}, failed: ${failedCount}`
    );
    for (var i = 0; i < result.failedExpectations.length; i++) {
      console.error(
        'Failure:',
        result.failedExpectations[i].message,
        result.failedExpectations[i].stack
      );
    }
  }
};
jasmine.getEnv().addReporter(consoleReporter);

function MsecsToHMS(totalMilliseconds) {
  var totalSeconds = totalMilliseconds / 1000.0;
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds - hours * 3600) / 60);
  var seconds = totalSeconds - hours * 3600 - minutes * 60;

  // round seconds
  seconds = Math.round(seconds * 100) / 100;

  var result = hours < 10 ? '0' + hours : hours;
  result += ':' + (minutes < 10 ? '0' + minutes : minutes);
  result += ':' + (seconds < 10 ? '0' + seconds : seconds);
  return result;
}

// runs before all suites
var startTime;
beforeAll(
  async function() {
    // change default test timeout from 5 seconds to 5 minutes
    startTime = new Date();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5 * 60 * 1000;
    console.group('Reactor JavaScript SDK Integration Tests');
    await helpers.cleanUpTestProperties();
  },
  300000 // 5 minutes is probably overkill, but cleaning up _can_ take a while
);

// runs after all suites
afterAll(function() {
  console.groupEnd('Reactor JavaScript SDK Integration Tests');
  var endTime = new Date();
  console.log('Total time to run tests:', MsecsToHMS(endTime - startTime));
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
