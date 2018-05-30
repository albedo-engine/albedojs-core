const webpack = require(`webpack`);
const merge = require(`webpack-merge`);
const path = require(`path`);

const config = require(`./config.js`);

const PATH = {
  dist: path.resolve(__dirname, `dist`)
};
const OUTPUT = {
  lib: `albedo.js`
};

const prodConfig = {
  output: {
    path: PATH.dist,
    filename: OUTPUT.lib,
    //publicPath: `/` + BUILD + `/`,
    library: `Albedo`,
    libraryTarget: `amd`
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({ minimize: true })
  ]
};

module.exports = merge(config, prodConfig);
