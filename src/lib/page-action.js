import Uri from 'urijs';
import Logger from '../lib/log';

const logger = new Logger('webext.lib.page-action', console);

export default class PageAction {
  constructor() {
    browser.webNavigation.onCommitted.addListener(({ frameId, tabId }) => {
      if (frameId === 0) {
        this.make(tabId);
      }
    });
  }

  getSitename(tabId) {
    return browser.tabs.executeScript(tabId, { file: '/sitename.js' });
  }

  makeSurveyUrl(qs) {
    return new Uri('/survey/index.html').query(qs).toString();
  }

  // Passed a tabs.Tab object, create and show the pageAction popup.
  make(tabId) {
    logger.log(`Showing for tab ${tabId}`);
    this.getSitename(tabId).then(sitename => {
      logger.log('sitename', sitename[0]);
      browser.pageAction.setPopup({
        tabId,
        popup: this.makeSurveyUrl({ sitename })
      });
      browser.pageAction.show(tabId);
    });
  }
}
