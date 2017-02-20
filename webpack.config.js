const CopyWebpackPlugin = require('copy-webpack-plugin');
const AfterBuildPlugin = require('./lib/webpack-after-build');
const webpack = require('webpack');
const { exec, mkdir } = require('shelljs');

const WATCH_MODE = process.argv.includes('--watch');

module.exports = {
  output: { path: 'build', filename: '[name].js' },
  // Separate entry points for the SDK add-on, WebExtension background script,
  // and survey (used both as a WebExtension popup and as a navigable page).
  entry: {
    'webextension/background': './src/webextension/background.js',
    'webextension/survey/index': './src/webextension/survey/index.jsx',
    index: './src/index.js'
  },
  externals: [
    // Treat all sdk requires as importable commonjs modules.
    (context, request, callback) => {
      if (/^sdk\//.test(request) || /^resource\:\/\//.test(request) || request === 'chrome') {
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
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: { presets: [ 'es2015', 'react' ] }
      },
      // Appropriately precompile SCSS files.
      { test: /\.scss$/, loaders: [ 'style', 'css', 'sass' ] },
      { test: /\.json$/, loader: 'json' },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'url-loader'
      },
      {
        test: /\.woff?2$/,
        loader: 'file?name=public/fonts/[name].[ext]'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `"${process.env.NODE_ENV || 'dev'}"`
    }),
    // Copy non-transformed files to build directory.
    new CopyWebpackPlugin([
      { from: 'src/data', to: 'data' },
      { from: 'src/icons', to: 'webextension/icons' },
      { from: 'src/webextension/manifest.json', to: 'webextension' },
      { from: 'src/webextension/survey/index.html', to: 'webextension/survey' },
      { from: 'package.json' },
      { from: 'LICENSE' }
    ]),
    // Package add-on when finished with build.
    new AfterBuildPlugin(() => {
      mkdir('-p', 'dist');
      exec(
        WATCH_MODE
          ? 'jpm post --addon-dir=build --post-url http://localhost:8888/'
          : 'jpm xpi --addon-dir=build --dest-dir=dist'
      );
    })
  ]
};
