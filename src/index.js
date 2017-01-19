import webext from 'sdk/webextension';
import { getMostRecentBrowserWindow } from 'sdk/window/utils';
import Logger from './lib/log';

const logger = new Logger('sdk.index', getMostRecentBrowserWindow().console);

logger.log('SDK startup');

webext.startup().then(({ browser }) => {
  logger.log('WebExtension startup');
  browser.runtime.onConnect.addListener(() => {
  });
});
