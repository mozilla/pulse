import Uri from 'urijs';
import Logger from '../lib/log';

const logger = new Logger('webext.lib.page-action', console);

const PULSE_STATUS = 'window.__pulse_initiated__';

export default class PageAction {
  constructor() {
    browser.webNavigation.onCompleted.addListener(({ frameId, tabId }) => {
      this.create(frameId, tabId);
    });
    browser.webNavigation.onHistoryStateUpdated.addListener((
      { frameId, tabId }
    ) =>
      {
        this.create(frameId, tabId);
      });
    browser.webNavigation.onBeforeNavigate.addListener(({ frameId, tabId }) => {
      this.destroy(frameId, tabId);
    });
    browser.tabs.onAttached.addListener(tabId => {
      this.show(tabId);
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
  create(frameId, tabId) {
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
      browser.tabs
        .executeScript(tabId, { code: `${PULSE_STATUS} = true;` })
        .then();
    });
  }

  // Passed frame and tab IDs, hide the pageAction popup for that tab if the
  // frame is an outermost frame.
  destroy(frameId, tabId) {
    if (frameId !== 0) return;
    logger.log(`Destroying page action for tab ${tabId}.`);
    browser.pageAction.hide(tabId);
    browser.tabs
      .executeScript(tabId, { code: `${PULSE_STATUS} = false;` })
      .then();
  }

  // Passed a tab IDs, show the pageAction popup for that tab if it has already
  // been created.
  show(tabId) {
    browser.tabs.executeScript(tabId, { code: PULSE_STATUS }).then(results => {
      if (results.length && !!results[0]) {
        logger.log(`Showing page action for tab ${tabId}.`);
        browser.pageAction.show(tabId);
      }
    });
  }
}
