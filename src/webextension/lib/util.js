import Logger from '../../lib/log';

const logger = new Logger('webext.lib.util', console);

// Passed a tabs.Tab object, create and show the pageAction popup.
export const makePageAction = tab => {
  browser.pageAction.setPopup({ tabId: tab.id, popup: '/survey/index.html' });
  browser.pageAction.show(tab.id);
  logger.log(`Created pageAction for ${tab.id}`);
};
