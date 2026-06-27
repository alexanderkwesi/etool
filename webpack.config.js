const webpack = require("webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = function override(config, env) {
  // Fallback configuration
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    net: false,
    tls: false,
    vm: false,
  };

  // Add devServer configuration if it doesn't exist
  if (!config.devServer) {
    config.devServer = {};
  }

  // Set host without any spaces
  config.devServer = {
    ...config.devServer,
    host: "127.0.0.1", // or '127.0.0.1' - no spaces!
    port: 4000,
    hot: true,
    open: true,
    historyApiFallback: true,
    allowedHosts: "all",
  };

  config.plugins = [
    ...config.plugins,
    new NodePolyfillPlugin(),
    new webpack.ProvidePlugin({
      process: "process/browser.js",
      Buffer: ["buffer", "Buffer"],
    }),
  ];

  return config;
};

//const webpack = require("webpack");
//const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

//module.exports = function override(config, env) {
  //config.resolve.fallback = {
  //  ...config.resolve.fallback,
    //fs: false,
    //net: false,
    //tls: false,
    //vm: false,
//  };

  //config.plugins = [
  //  ...config.plugins,
    //new NodePolyfillPlugin(), // This handles most node polyfills automatically
    //new webpack.ProvidePlugin({
     // process: "process/browser.js",
     // Buffer: ["buffer", "Buffer"],
  //  }),
//  ];

//  return config;
//};
