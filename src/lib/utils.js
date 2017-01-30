import Logger from '../lib/log';
import { getMostRecentBrowserWindow } from 'sdk/window/utils';
import tabs from 'sdk/tabs';

const logger = new Logger('sdk.utils', getMostRecentBrowserWindow().console);

// Passed numeric tab and window IDs, returns an object containing the full Tab
// and BrowserWindow objects from which the report was intitiated. The
// retrieval methods are horribly inefficient, but it doesn't appear to be
// possible to look up a tab or window from its ID.
export const getContext = (tabId, windowId) => {
  logger.log('Getting context of window/tab pair', windowId, '/', tabId);
  for (let tab of tabs) {
    if (tab.id === `-${windowId}-${tabId}`) {
      return { tab, window: tab.window };
    }
  }
  throw(`Could not find window/tab pair ${windowId}/${tabId}.`);
};
