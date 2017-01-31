import Logger from '../lib/log';
import { makePageAction } from './lib/util';

const logger = new Logger('webext.background', console);

// Show the page action for all existing tabs.
browser.tabs.query({}).then(tabs => {
  for (let tab of tabs) {
    makePageAction(tab);
  }
  logger.log(`Loaded pageAction into ${tabs.length} existing tabs.`);
});

// Show the page action on new tabs.
browser.tabs.onCreated.addListener(tab => makePageAction(tab));
