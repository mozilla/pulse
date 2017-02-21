import Uri from 'urijs';
import Logger from '../lib/log';

const logger = new Logger('webext.lib.page-action', console);

export default class PageAction {
  constructor() {
    browser.webNavigation.onBeforeNavigate.addListener(({ frameId, tabId }) => {
      this.hide(frameId, tabId);
    });
    browser.webNavigation.onCompleted.addListener(({ frameId, tabId }) => {
      this.show(frameId, tabId);
    });
  }

  getSitename(tabId) {
    return browser.tabs.executeScript(tabId, { file: '/sitename.js' });
  }

  makeSurveyUrl(qs) {
    return new Uri('/survey/index.html').query(qs).toString();
  }

  hide(frameId, tabId) {
    if (frameId !== 0) {
      return;
    }
    browser.pageAction.hide(tabId);
  }
  
  // Passed a tabs.Tab object, create and show the pageAction popup.
  show(frameId, tabId) {
    if (frameId !== 0) {
      return;
    }
    logger.log(`Showing for tab ${tabId}`);
    this.getSitename(tabId).then(sitename => {
      browser.pageAction.setPopup({
        tabId,
        popup: this.makeSurveyUrl({ sitename })
      });
      browser.pageAction.show(tabId);
    });
  }
}
