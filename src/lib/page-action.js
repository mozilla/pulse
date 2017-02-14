import Logger from '../lib/log';

const logger = new Logger('webext.lib.page-action', console);

export default class PageAction {
  constructor() {
    browser.webNavigation.onCommitted.addListener(details => {
      this.make(details.tabId);
    });
  }

  // Passed a tabs.Tab object, create and show the pageAction popup.
  make(tabId) {
    logger.log(`Showing for tab ${tabId}`);
    browser.pageAction.setPopup({ tabId, popup: '/survey/index.html' });
    browser.pageAction.show(tabId);
  }
}
