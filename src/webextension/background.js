import Logger from '../lib/log';
import { showPageAction } from './lib/util';

const logger = new Logger('webext.background', console);

// Show the page action for all existing tabs.
browser.tabs.query({}).then(tabs => {
  for (let tab of tabs) {
    logger.log('Loaded pageAction into existing tab', tab.id);
    showPageAction(tab);
  }
});

// Show the page action on new tabs.
browser.tabs.onCreated.addListener(tab => {
  logger.log('Loaded pageAction into new tab', tab.id);
  showPageAction(tab);
});

// Handle clicks on the pageAction icon.
browser.pageAction.onClicked.addListener(() => {
  logger.log('Click on pageAction');
});
