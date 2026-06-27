/**
 * config-overrides.js
 * ────────────────────────────────────────────────────────────
 * Required by react-app-rewired. Must sit in the project root
 * (same folder as package.json).
 *
 * Polyfills Node.js built-ins so browser-targeted packages
 * (crypto, stream, buffer, etc.) compile without errors under
 * Create React App's Webpack 5 config, which no longer includes
 * these shims by default.
 */

const webpack = require("webpack");

module.exports = function override(config) {
  // ── Node built-in polyfills ──────────────────────────────
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    buffer: require.resolve("buffer/"),
    util: require.resolve("util/"),
    process: require.resolve("process/browser.js"),
    path: require.resolve("path-browserify"),
    os: require.resolve("os-browserify/browser"),
    zlib: require.resolve("browserify-zlib"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    events: require.resolve("events/"),
    querystring: require.resolve("querystring-es3"),
    vm: require.resolve("vm-browserify"),
    // Server-only — disable in the browser bundle
    fs: false,
    net: false,
    tls: false,
    async_hooks: false,
  };

  // ── Global shims ─────────────────────────────────────────
  config.plugins = [
    ...config.plugins,

    // Make `process` and `Buffer` available globally
    new webpack.ProvidePlugin({
      process: "process/browser.js",
      Buffer: ["buffer", "Buffer"],
    }),

    // Rewrite `node:` protocol imports (e.g. `import path from 'node:path'`)
    // so Webpack can resolve them via the fallbacks above.
    new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
      resource.request = resource.request.replace(/^node:/, "");
    }),

    // Silence warnings for server-only packages accidentally bundled
    new webpack.IgnorePlugin({
      resourceRegExp: /^(express|on-finished|raw-body|async_hooks)$/,
    }),
  ];

  return config;
};
