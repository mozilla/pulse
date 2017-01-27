import webext from 'sdk/webextension';
import { getMostRecentBrowserWindow } from 'sdk/window/utils';
import Logger from './lib/log';
import measure from './measurements';

const logger = new Logger('sdk.index', getMostRecentBrowserWindow().console);

logger.log('SDK startup');

// On startup, establish a connection with the embedded WebExtension.
webext.startup().then(({ browser }) => {
  logger.log('WebExtension startup');

  // Add a listener to receive submissions from the WebExtension.
  browser.runtime.onMessage.addListener(data => {
    logger.log('Received message from WebExtension', data);

    // When a submission is received, augment it with measurements before
    // submitting.
    const survey = new Map(Object.entries(JSON.parse(data)));
    measure(survey).then(measurements => {
      logger.log('Ready to submit', measurements);
    });
  });
});
