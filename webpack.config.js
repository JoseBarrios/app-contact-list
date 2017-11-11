const webpack = require('webpack'); //to access built-in plugins
const path = require('path');

let javascripts = [];
javascripts.push('./node_modules/@josebarrios/thing/index.js')
javascripts.push('./node_modules/systemjs/dist/system.js')
javascripts.push('./node_modules/lodash/lodash.js')

const config = {
  entry: javascripts,
  output: {
    path: path.resolve(__dirname, 'elements/ui-job-posting-card'),
    filename: 'controller.js'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  plugins: [
  ]
};

module.exports = config;
