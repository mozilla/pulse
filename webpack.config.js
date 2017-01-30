const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

const WATCH_MODE = process.argv.includes('--watch');

module.exports = {
  output: { path: 'build', filename: '[name].js' },
  // Separate entry points for the SDK add-on, WebExtension background script,
  // and survey (used both as a WebExtension popup and as a navigable page).
  entry: {
    'webextension/background': './src/webextension/background.js',
    'webextension/survey/survey': './src/webextension/survey/survey.js',
    index: './src/index.js'
  },
  externals: [
    // Treat all sdk requires as importable commonjs modules.
    (context, request, callback) => {
      if (/^sdk\//.test(request)) {
        return callback(null, `commonjs ${request}`);
      }
      return callback();
    }
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: { presets: [ 'es2015' ] }
      },
      // Appropriately precompile SCSS files.
      { test: /\.scss$/, loaders: [ 'style', 'css', 'sass' ] }
    ]
  },
  plugins: [
    // Copy non-transformed files to build directory.
    new CopyWebpackPlugin([
      { from: 'src/data', to: 'data' },
      { from: 'src/icons', to: 'webextension/icons' },
      { from: 'src/webextension/manifest.json', to: 'webextension' },
      { from: 'src/webextension/survey/index.html', to: 'webextension/survey' },
      { from: 'package.json' },
      { from: 'LICENSE.md' }
    ]),
    // Package add-on when finished with build.
    new WebpackShellPlugin({
      onBuildEnd: [
        'mkdir -p dist',
        WATCH_MODE
          ? 'jpm post --addon-dir=build --post-url http://localhost:8888/'
          : 'jpm xpi --addon-dir=build --dest-dir=dist'
      ]
    }),
    // Clean up extraneous files from the build directory.
    new WebpackCleanupPlugin()
  ]
};
