import Logger from '../../lib/log';

const logger = new Logger('webext.lib.util', console);

// If being run in the WebExtension context, send a message to the SDK add-on.
// Otherwise use the regular logger.
export const sendMessage = (type, payload) => {
  if (typeof browser !== 'undefined') {
    browser.runtime.sendMessage({ type, payload });
  } else {
    logger.log('Sending mock message', type, payload);
  }
};
