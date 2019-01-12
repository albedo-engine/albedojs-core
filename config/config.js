import includePaths from 'rollup-plugin-includepaths';
import path from 'path';
import typescript from 'rollup-plugin-typescript2';

import pkg from '../package.json';

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

  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],

  plugins: [
    includePaths({ paths: [ 'src' ] }),
    typescript({ typescript: require('typescript') }),
  ]

};
