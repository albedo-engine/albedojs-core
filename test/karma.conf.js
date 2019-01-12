const path = require('path');
const rollupConfig = require('../config/test.config');

/* /////////////////////////////////////////////////////////////////////////////
//                              CONFIGURATION                                 //
///////////////////////////////////////////////////////////////////////////// */

const BROWSERS = {};

const COLORS = true;

/* /////////////////////////////////////////////////////////////////////////////
//                              KARMA                                         //
///////////////////////////////////////////////////////////////////////////// */

const PATHS = {
  Dist: path.resolve(__dirname, '../dist')
};

const production = process.env.NODE_ENV === 'production';

let browser = 'Chrome';
// When pushing in production, the CI will use Puppeteer for headless testing.
if (production) {
  process.env.CHROME_BIN = require('puppeteer').executablePath();
  browser = 'ChromeHeadless';
}

module.exports = function(karmaConfig) {
  const entryFolder = karmaConfig.entry;
  const entryFile = `${entryFolder}/index.js`;
  const outputFile = `${entryFolder}.xml`;

  const config = {
    browsers: [ browser ],

    frameworks: [ 'mocha', 'chai' ],

    files: [
      {
        pattern: entryFile,
        watched: false
      }
    ],

    preprocessors: {},

    singleRun: production,

    // you can define custom flags
    customLaunchers: BROWSERS,

    reporters: [ 'progress', 'junit' ],

    // the default configuration
    junitReporter: {
      outputDir: path.resolve(PATHS.Dist, 'test'),
      outputFile: outputFile,
      useBrowserName: false
    },

    rollupPreprocessor: rollupConfig,

    colors: COLORS
  };

  config.preprocessors[entryFile] = [ 'rollup' ];

  karmaConfig.set(config);
};
