const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

const config = {
  entry: {
    'webextension/background': './src/webextension/background.js',
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
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/icons', to: 'webextension/icons' },
      { from: 'src/webextension/manifest.json', to: 'webextension' },
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
