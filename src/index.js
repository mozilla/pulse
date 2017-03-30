import { PageMod } from 'sdk/page-mod';
import self from 'sdk/self';
import { storage } from 'sdk/simple-storage';
import webext from 'sdk/webextension';
import tabs from 'sdk/tabs';
import { getMostRecentBrowserWindow } from 'sdk/window/utils';

import { e10sStatus, e10sProcessCount } from './lib/e10s-status';
import Logger from './lib/log';
import NotificationWatcher from './lib/notify';
import sendEvent from './lib/metrics';
import measure from './measurements';

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
  browser.runtime.onMessage.addListener(msg => {
    switch (msg.type) {
      // When the survey is loaded, associate the passed ID with the
      // currently-active tab for future processing. Then send the pulse-loaded
      // Telemetry ping.
      case 'loaded': {
        if (!storage.id) {
          storage.id = {};
        }
        storage.id[msg.payload.id] = tabs.activeTab;
        const loadedPing = {
          method: 'pulse-loaded',
          id: msg.payload.id,
          type: msg.payload.type
        };
        logger.log('Loaded', loadedPing);
        sendEvent(loadedPing);
        break;
      }

      // When the survey is unloaded without being submitted,
      case 'unloaded': {
        const unloadedPing = {
          method: 'pulse-unloaded',
          id: msg.payload.id,
          type: msg.payload.type
        };
        logger.log('Unloaded', unloadedPing);
        sendEvent(unloadedPing);
        break;
      }

      // When a submission is received, augment it with measurements before
      // submitting.
      case 'submitted': {
        measure(msg.payload)
          .then(measurements => {
            const submittedPing = Object.assign(msg.payload, measurements, {
              e10sStatus: e10sStatus(),
              e10sProcessCount: e10sProcessCount(),
              method: 'pulse-submitted'
            });
            logger.log('Submitted', submittedPing);
            sendEvent(submittedPing);
            delete storage.id[msg.payload.id];
          })
          .catch(err => {
            logger.log(err);
          });
        break;
      }

      //
      case 'survey-url': {
        logger.log('Received survey url', msg.payload);
        storage.surveyUrl = msg.payload;
        break;
      }

      default: {
        logger.error('Unknown message type.', msg);
        break;
      }
    }
  });

  new NotificationWatcher();
});
