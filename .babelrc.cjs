/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

module.exports = function (api) {
  api.cache(true);

  // Skip Babel config if Parcel is running (Parcel has its own transpilation)
  // NOTE: there will be a warning when running this, but you can't suppress it
  // when you have a .babelrc file that isn't a static json file.
  if (process.env.PARCEL_NODE) {
    return { presets: [] };
  }

  const presets = [];
  const env = process.env.BABEL_ENV || process.env.NODE_ENV;

  if (env === 'cjs') {
    // CommonJS build
    presets.push([
      '@babel/preset-env',
      {
        modules: 'commonjs',
        targets: {
          node: '22'
        }
      }
    ]);
  } else if (env === 'browser') {
    // Browser build (not Parcel)
    presets.push([
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          browsers: [
            'last 2 chrome versions',
            'last 2 firefox versions',
            'last 2 safari versions',
            'last 2 edge versions'
          ]
        }
      }
    ]);
  } else {
    // Default ES module build for Node.js
    presets.push([
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          node: '22'
        }
      }
    ]);
  }

  return {
    presets
  };
};
