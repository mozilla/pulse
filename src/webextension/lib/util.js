import Logger from '../../lib/log';
import Uri from 'urijs';

const logger = new Logger('webext.lib.util', console);

// Passed a Tab object, construct the URL for a survey.
const surveyUrl = tab => {
  return new Uri('/survey/index.html')
    .query({ tab: tab.id, window: tab.windowId })
    .toString();
};

// Passed a Tab object, show the pageAction popup.
export const showPageAction = tab => {
  logger.log('Showing page action for window/tab', tab.windowId, '/', tab.id);
  browser.pageAction.setPopup({ tabId: tab.id, popup: surveyUrl(tab) });
  browser.pageAction.show(tab.id);
};
