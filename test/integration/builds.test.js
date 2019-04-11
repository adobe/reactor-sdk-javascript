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
import helpers from './helpers';

//TODO: test the build endpoints once Library tests have been written

// Builds
// https://developer.adobelaunch.com/api/builds
helpers.describe('Build API', function() {
  // Create a Build
  // https://developer.adobelaunch.com/api/builds/create/
  helpers.xit('creates a new Build', async function() {
    const theProperty = await helpers.findOrMakeTestingProperty('Build');
    //TODO: test createBuild
  });

  // Get a Build
  // https://developer.adobelaunch.com/api/builds/fetch/
  helpers.xit('gets a Build', async function() {
    //TODO: test getBuild
  });

  // Get the Environment
  // https://developer.adobelaunch.com/api/builds/environment/
  helpers.xit("gets a Build's Environment", async function() {
    //TODO: test getEnvironmentForBuild
  });

  // Get the Library
  // https://developer.adobelaunch.com/api/builds/library/
  helpers.xit("gets a Build's Library", async function() {
    //TODO: test getLibraryForBuild
  });

  // List Builds
  // https://developer.adobelaunch.com/api/builds/list/
  helpers.xit('lists Builds for a Property', async function() {
    //TODO: test listBuildsForProperty
  });

  // List DataElements
  // https://developer.adobelaunch.com/api/builds/data_elements/
  helpers.xit("lists a Build's DataElements", async function() {
    //TODO: test listDataElementsForBuild
  });

  // List Extensions
  // https://developer.adobelaunch.com/api/builds/extensions/
  helpers.xit("lists a Build's Extensions", async function() {
    //TODO: test listExtensionsForBuild
  });

  // List Rules
  // https://developer.adobelaunch.com/api/builds/rules/
  helpers.xit("lists a Build's Rules", async function() {
    //TODO: test listRulesForBuild
  });
});
