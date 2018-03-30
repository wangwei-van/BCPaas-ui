const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer')();


module.exports = {
  entry: {
    app: path.resolve(__dirname, '../src/index.js')
  },
  output: {
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        include: /src/
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }, {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', {
          loader: 'postcss-loader',
          options: {
            path: './postcss.config.js'
          }
        }, 'sass-loader']
      }, {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', {
          loader: 'postcss-loader',
          options: {
            path: './postcss.config.js'
          }
        }, {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true
          }
        }]
      }
    ]
  },
  optimization: {
    runtimeChunk: {
      name: 'manifest'
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../index.template.html'),
      favicon: path.resolve(__dirname, '../favicon.ico')
    }),
    new webpack.DllReferencePlugin({
      context: path.resolve(__dirname, '../'),
      manifest: require('../manifest.json')
    })
  ],
  resolve: {
    alias: {
      Util: path.resolve(__dirname, "../src/util"),
      Store: path.resolve(__dirname, "../src/store"),
      Actions: path.resolve(__dirname, "../src/actions"),
      Constants: path.resolve(__dirname, "../src/constants"),
      Containers: path.resolve(__dirname, "../src/containers"),
      Components: path.resolve(__dirname, "../src/components"),
      Services: path.resolve(__dirname, "../src/services"),
    },
    extensions: ['.js', '.jsx']
  }
}