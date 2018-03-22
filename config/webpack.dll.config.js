const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  // mode: 'production',
  entry: {
    bundle: ['react', 'prop-types', 'react-dom', 'react-router', 'react-router-redux',
      'redux', 'react-redux', 'lodash', 'isomorphic-fetch', 'antd', 'js-cookie']
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].dll.js',
    library: '[name]_lib'
  },
  optimization: {
    // minimize: true
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(__dirname, '../manifest.json'),
      name: '[name]_lib'
    })
  ]
}