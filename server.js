const path = require('path');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');

const serverConfig = require('./config/server.config.js');
const config = require('./config/webpack.dev.js');
const proxy = require('./config/proxy.config.js');

config.entry['app'].unshift("webpack-dev-server/client?" + serverConfig.host + ":" + serverConfig.port + "/", "webpack/hot/only-dev-server");

const options = Object.assign({}, {
  contentBase: config.output.path,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  },
  hot: true,
  historyApiFallback: true
}, proxy)

const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(serverConfig.port, function () {
  console.log('dev server listening on port 3000!\n');
})