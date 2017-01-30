import tabs from 'sdk/tabs';

// Passed numeric tab and window IDs, returns an object containing the full Tab
// and BrowserWindow objects from which the report was intitiated. The
// retrieval methods are horribly inefficient, but it doesn't appear to be
// possible to look up a tab or window from its ID.
export const getTab = (tabId, windowId) => {
  for (let tab of tabs) {
    if (tab.id === `-${tabId}-${windowId}`) {
      return { tab, window: tab.window };
    }
  }
};
