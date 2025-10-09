module.exports = function (api) {
  api.cache(true);

  // Skip Babel config if Parcel is running (Parcel has its own transpilation)
  if (process.env.PARCEL_WORKER_ID || process.env.NODE_ENV === 'test') {
    return {};
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
