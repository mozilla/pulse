import { PageMod } from 'sdk/page-mod';
import self from 'sdk/self';
import webext from 'sdk/webextension';
import { getMostRecentBrowserWindow } from 'sdk/window/utils';

import Logger from './lib/log';
import handleMessage from './lib/messages';
import NotificationWatcher from './lib/notify';

const logger = new Logger('sdk.index', getMostRecentBrowserWindow().console);

logger.log('SDK startup');

PageMod({
  include: '*',
  contentScriptFile: self.data.url('pagemonitor.js'),
  contentScriptWhen: 'start'
});

// On startup, establish a connection with the embedded WebExtension.
webext.startup().then(({ browser }) => {
  logger.log('WebExtension startup');

  // Listen for messages from the WebExtension.
  browser.runtime.onMessage.addListener(handleMessage);

  // Start time for prompted feedback.
  new NotificationWatcher();
});
