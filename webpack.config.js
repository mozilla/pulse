const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

const config = {
  entry: {
    'webextension/background': './src/webextension/background.js',
    'webextension/survey/survey': './src/webextension/survey/survey.js',
    'index': './src/index.js'
  },
  output: {
    path: 'build',
    filename: '[name].js'
  },
  externals: [
    (context, request, callback) => {
      if(/^sdk\//.test(request)){
        return callback(null, `commonjs ${request}`);
      }
      callback();
    }
  ],
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loaders: [
          'style',
          'css',
          'sass'
        ]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/icons', to: 'webextension/icons' },
      { from: 'src/webextension/manifest.json', to: 'webextension' },
      { from: 'src/webextension/survey/index.html', to: 'webextension/survey' },
      { from: 'package.json' },
      { from: 'LICENSE.md' }
    ]),
    new WebpackShellPlugin({
      onBuildEnd: [
        'mkdir -p dist',
        'jpm xpi --addon-dir=build --dest-dir=dist'
      ]
    }),
    new WebpackCleanupPlugin()
  ]
};

module.exports = config;
