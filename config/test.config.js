import babel from 'rollup-plugin-babel';
import includePaths from 'rollup-plugin-includepaths';
import path from 'path';

const ROOT = path.resolve(__dirname, `..`);
const PATH = {
  SRC: `${ROOT}/src`,
  TEST: `${ROOT}/test`,
  DIST: `${ROOT}/dist`
};

const LIBRARY_NAME = `AlbedoTest`;
const INPUT_FILE = `${PATH.TEST}/index.js`;
const OUTPUT_FILE = `${PATH.DIST}/albedo.testlib.js`;

export default {
  input: INPUT_FILE,
  output: {
    file: OUTPUT_FILE,
    format: `es`,
    name: LIBRARY_NAME
  },
  plugins: [
    includePaths({ paths: [ `src`, `test` ] }),
    babel({
      exclude: `node_modules/**`,
      babelrc: false,
      presets: [ [ `env`, { modules: false } ] ]
    })
  ]
};
