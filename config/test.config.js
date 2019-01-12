const includePaths = require('rollup-plugin-includepaths');

module.exports = {
  
  output: {
    format: 'iife',
    name: 'AlbedoTests'
  },

  plugins: [
    includePaths({ paths: [ 'src', 'test' ] })
  ]

};
