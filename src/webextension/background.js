const { Logger } = require('../lib/log');

const logger = new Logger('background', console);


// Show the page action for all existing tabs.
browser.tabs.query({}).then(tabs => {
  for (let tab of tabs) {
    logger.log('Loaded pageAction into existing tab', tab.id);
    browser.pageAction.show(tab.id);
  }
});

// Show the page action on new tabs.
browser.tabs.onCreated.addListener(tab => {
  logger.log('Loaded pageAction into new tab', tab.id);
  browser.pageAction.show(tab.id);
});

// Handle clicks on the pageAction icon.
browser.pageAction.onClicked.addListener(() => {
  logger.log('Click on pageAction');
});
