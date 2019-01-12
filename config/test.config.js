const includePaths = require('rollup-plugin-includepaths');
const path = require('path');

const ROOT = path.resolve(__dirname, `..`);
const PATH = {
  SRC: `${ROOT}/src`,
  TEST: `${ROOT}/test`,
  DIST: `${ROOT}/dist`
};

const LIBRARY_NAME = `AlbedoTest`;
const INPUT_FILE = `${PATH.TEST}/index.js`;
const OUTPUT_FILE = `${PATH.DIST}/albedo.testlib.js`;

module.exports = {
  output: {
    format: 'iife',
    name: 'AlbedoTests'
  },
  plugins: [
    includePaths({ paths: [ `src`, `test` ] }),
  ]
};
