#!/usr/bin/env node

/*
Script to fix CommonJS require paths from .js to .cjs extensions
This is needed because Babel doesn't automatically rewrite import paths
when using --out-file-extension .cjs
*/

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const cjsDir = path.join(__dirname, '../lib/cjs');

// Find all .cjs files in the lib/cjs directory
const cjsFiles = glob.sync('**/*.cjs', { cwd: cjsDir });

console.log(`Found ${cjsFiles.length} .cjs files to process`);

cjsFiles.forEach(file => {
  const filePath = path.join(cjsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

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
