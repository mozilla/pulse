const styles = require('./styles.scss');

const { Logger } = require('../../lib/log');
const Open = require('./lib/open');

const logger = new Logger('survey', window.console);


function main() {
  logger.log('Initializing');

  window.app = {
    open: new Open()
  };
}

if (document.readyState !== 'loading'){
  main();
} else {
  document.addEventListener('DOMContentLoaded', main);
}
