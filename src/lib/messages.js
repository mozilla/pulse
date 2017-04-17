import { storage } from 'sdk/simple-storage';
import tabs from 'sdk/tabs';
import { getMostRecentBrowserWindow } from 'sdk/window/utils';

import measure from '../measurements';
import { e10sProcessCount, e10sStatus } from './e10s-status';
import Logger from './log';
import sendEvent from './metrics';

const logger = new Logger(
  'sdk.lib.messages',
  getMostRecentBrowserWindow().console
);

export const storeTab = uuid => {
  // Associate a tab with the passed randomly-generated UUID. This allows us to
  // reliably retrieve it later for measurement.
  if (!storage.id) {
    storage.id = {};
  }
  logger.log(Object.keys(storage.id));
  if (uuid in storage.id) {
    logger.log(`Not storing ${uuid}; already exists as ${storage.id[uuid].id}`);
  } else {
    logger.log(`Storing ${uuid} as ${tabs.activeTab.id}`);
    storage.id[uuid] = tabs.activeTab;
  }
};

export default msg => {
  switch (msg.type) {
    // When the survey is loaded, associate the passed ID with the
    // currently-active tab for future processing. Then send the pulse-loaded
    // Telemetry ping.
    case 'loaded': {
      storeTab(msg.payload.id);
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
};
