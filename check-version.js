// Enforce a hard requirement on the requested NodeJS version.
let semver = require('semver');
let pkg = require('./package');

const version = pkg.engines && pkg.engines.node;
if (!semver.satisfies(process.version, version)) {
  console.error(
    `Reactor SDK requires node version ${version},
which is not satisfied by your current version (${process.version}).`
  );
  process.exit(1);
}

