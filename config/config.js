import includePaths from 'rollup-plugin-includepaths';
import path from 'path';

const ROOT = path.resolve(__dirname, '..');
const PATH = {
  Src: path.resolve(ROOT, 'src'),
  Dist: path.resolve(ROOT, 'dist')
};

const LIBRARY_NAME = 'Albedo';
const INPUT = path.resolve(PATH.Src, 'albedo.js');
const OUTPUT = path.resolve(PATH.Dist, 'albedo');

export default {
  input: INPUT,
  output: {
    file: OUTPUT,
    format: 'es',
    name: LIBRARY_NAME
  },
  plugins: [
    includePaths({ paths: [ 'src' ] })
  ]
};
