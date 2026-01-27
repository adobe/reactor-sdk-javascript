#!/usr/bin/env node

/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.

Script to fix CommonJS require paths from .js to .cjs extensions
This is needed because Babel doesn't automatically rewrite import paths
when using --out-file-extension .cjs
*/

const fs = require('fs');
const path = require('path');

const cjsDir = path.join(__dirname, '../lib/cjs');

// Find all .cjs files in the lib/cjs directory
const cjsFiles = fs
  .readdirSync(cjsDir, { recursive: true })
  .filter((file) => file.endsWith('.cjs'));

console.log(`Found ${cjsFiles.length} .cjs files to process`);

cjsFiles.forEach((file) => {
  const filePath = path.join(cjsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Replace require("./filename.js") with require("./filename.cjs")
  // This regex matches require statements with relative paths ending in .js
  const updatedContent = content.replace(
    /require\(["'](\.[^"']*?)\.js["']\)/g,
    'require("$1.cjs")'
  );

  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`Updated require paths in: ${file}`);
  }
});

console.log('CommonJS require path fixing complete!');

