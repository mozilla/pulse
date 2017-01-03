const { Logger } = require('../lib/log');

const logger = new Logger('background', console);


browser.pageAction.onClicked.addListener(function () {
  logger.log('pageAction created');
});

browser.tabs.onCreated.addListener(tab => {
  logger.log(`tab created ${tab.id}`);
  browser.pageAction.show(tab.id);
});
