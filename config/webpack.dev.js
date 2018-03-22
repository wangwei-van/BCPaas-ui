const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const config = require('./webpack.config.js');

module.exports = merge(config, {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: {
    app: [path.resolve(__dirname, '../src/index.js')]
  },
  output: {
    publicPath: '/',
    filename: '[name].js'
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
});