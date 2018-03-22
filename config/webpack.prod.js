const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');

const config = require('./webpack.config.js');

module.exports = merge(config, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    publicPath: '/',
    filename: '[name].[chunkhash].js'
  },
  optimization: {
    minimize: true
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin()
  ]
});