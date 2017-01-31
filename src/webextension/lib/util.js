import Logger from '../../lib/log';

const logger = new Logger('webext.lib.util', console);

// Passed a tabs.Tab object, create and show the pageAction popup.
export const makePageAction = tab => {
  browser.pageAction.setPopup({ tabId: tab.id, popup: '/survey/index.html' });
  browser.pageAction.show(tab.id);
  logger.log(`Created pageAction for ${tab.id}`);
};

// If being run in the WebExtension context, send a message to the SDK add-on.
// Otherwise use the regular logger.
export const sendMessage = (type, payload) => {
  if (typeof browser !== 'undefined') {
    browser.runtime.sendMessage({ type, payload });
  } else {
    logger.log('Sending mock message', type, payload);
  }
};
