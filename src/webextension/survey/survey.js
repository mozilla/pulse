const styles = require('./styles.scss'); // eslint-disable-line no-unused-vars

const { Logger } = require('../../lib/log');
const logger = new Logger('survey', window.console);

logger.log('Loaded');


function main() {
  logger.log('Main running.');
  window.addEventListener('click', evt => {
    if (evt.target.nodeName.toLowerCase() === 'button') {
      logger.log('Opening in new tab.');
      browser.tabs.create({
        url: '/survey/index.html'
      });
    }
  });
}

if (document.readyState !== 'loading'){
  main();
} else {
  document.addEventListener('DOMContentLoaded', main);
}
