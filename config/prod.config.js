import { uglify } from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';
import config from './config';

// Writes the output as [name].min.js
config.output.file += `.min.js`;
config.plugins = [
  uglify({}, minify)
];

export default config;
