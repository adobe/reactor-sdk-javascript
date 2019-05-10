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

// Enforce a hard requirement on the requested NodeJS version.
let semver = require('semver');
let pkg = require('../package');

const version = pkg.engines && pkg.engines.node;
if (!semver.satisfies(process.version, version)) {
  console.error(
    `Reactor SDK requires node version ${version},
which is not satisfied by your current version (${process.version}).`
  );
  process.exit(1);
}

