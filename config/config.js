const path = require(`path`);

const ROOT = path.join(__dirname, `..`);

const PATH = {
  src: path.resolve(ROOT, `src`)
};
const INPUT = {
  lib: path.resolve(PATH.src, `albedo.js`)
};

console.log(PATH);

const config = {
  entry: INPUT.lib,
  module: {}
};

module.exports = config;
