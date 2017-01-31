import { storage } from 'sdk/simple-storage';
import webext from 'sdk/webextension';
import tabs from 'sdk/tabs';
import { getMostRecentBrowserWindow } from 'sdk/window/utils';

import Logger from './lib/log';
import measure from './measurements';

const logger = new Logger('sdk.index', getMostRecentBrowserWindow().console);

logger.log('SDK startup');

// On startup, establish a connection with the embedded WebExtension.
webext.startup().then(({ browser }) => {
  logger.log('WebExtension startup');

  // Listen for messages from the WebExtension.
  browser.runtime.onMessage.addListener(msg => {
    switch (msg.type) {
      // If an id is received, associate that ID with the currently-active tab
      // for future processing.
      case 'id':
        if (!storage.id) {
          storage.id = {};
        }
        logger.log(`Initializing survey for ${msg.payload}`);
        storage.id[msg.payload] = tabs.activeTab;
        break;

      // When a submission is received, augment it with measurements before
      // submitting.
      case 'submission':
        measure(msg.payload).then(measurements => {
          logger.log('Submitting', measurements);
          delete storage.id[msg.payload.id];
        });
        break;

      default:
        logger.error('Unknown message type.', msg);
        break;
    }
  });
});
