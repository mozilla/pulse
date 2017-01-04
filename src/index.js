const webext = require('sdk/webextension');
const { getMostRecentBrowserWindow } = require('sdk/window/utils');
const { Logger } = require('./lib/log');
const logger = new Logger('index', getMostRecentBrowserWindow().console);

logger.log('SDK startup');

webext.startup().then(({ browser }) => {
  logger.log('WebExtension startup');
  browser.runtime.onConnect.addListener(() => {});
});
