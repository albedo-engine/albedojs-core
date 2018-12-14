const path = require('path');
const rollupConfig = require('../config/test.config');

/* /////////////////////////////////////////////////////////////////////////////
//
//                              CONFIGURATION
//
///////////////////////////////////////////////////////////////////////////// */

const BROWSERS = {};

const COLORS = true;

/* /////////////////////////////////////////////////////////////////////////////
//
//                              KARMA
//
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

module.exports = function(config) {
  config.set({

    browsers: [ browser ],

    frameworks: [ 'mocha', 'chai' ],

    files: [
      /**
        * Make sure to disable Karma’s file watcher
        * because the preprocessor will use its own.
        */
      { pattern: 'unit/index.js', watched: false }
    ],

    preprocessors: {
      'unit/index.js': [ 'rollup' ]
    },

    singleRun: production,

    // you can define custom flags
    customLaunchers: BROWSERS,

    reporters: [ 'progress', 'junit' ],

    // the default configuration
    junitReporter: {
      outputDir: `${PATHS.Dist}/test`,
      outputFile: 'unit.xml',
      useBrowserName: false
    },

    rollupPreprocessor: rollupConfig,

    colors: COLORS

  });
};
