const webpack = require(`webpack`);
const merge = require(`webpack-merge`);
const path = require(`path`);

const config = require(`./config.js`);

const PATH = {
  dist: path.resolve(__dirname, `dist`),
  example: path.resolve(__dirname, `example`)
};
const OUTPUT = {
  lib: `albedo.js`
};

const devConfig = {
  devtool: `eval-source-map`,
  devServer: {
    inline: true,
    contentBase: PATH.example,
    port: `3001`
  },
  output: {
    path: PATH.dist,
    filename: OUTPUT.lib,
    library: `Albedo`,
    libraryTarget: `window`
  },
  module: {},
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};

module.exports = merge(config, devConfig);
