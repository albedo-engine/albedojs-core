import includePaths from 'rollup-plugin-includepaths';
import path from 'path';

const ROOT = path.resolve(__dirname, `..`);
const PATH = {
  SRC: `${ROOT}/src`,
  DIST: `${ROOT}/dist`
};

const LIBRARY_NAME = `Albedo`;
const INPUT = `${PATH.SRC}/albedo.js`;
const OUTPUT = `${PATH.DIST}/albedo`;

export default {
  input: INPUT,
  output: {
    file: OUTPUT,
    format: `es`,
    name: LIBRARY_NAME
  },
  plugins: [
    includePaths({ paths: [ `src` ] })
  ]
};
