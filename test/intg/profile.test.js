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

// Profiles
// https://developer.adobelaunch.com/api/profiles
describe('Profile API', function() {
  // Get a Profile
  // https://developer.adobelaunch.com/api/profiles/fetch//
  it('returns a User', async function() {
    const response = await reactor.getProfile();
    const user = response.data;
    expect(user.type).toBe('users');
    expect(user.id).toMatch(helpers.idUR);
  });
});
