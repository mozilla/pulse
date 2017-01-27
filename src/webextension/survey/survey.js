// eslint-disable-next-line no-unused-vars
import styles from './styles.scss';
import Logger from '../../lib/log';

import Open from './lib/open';
import Submit from './lib/submit';

const logger = new Logger('webext.survey', window.console);

function main() {
  logger.log('Initializing');

  window.app = { open: new Open(), submit: new Submit() };
}

if (document.readyState !== 'loading') {
  main();
} else {
  document.addEventListener('DOMContentLoaded', main);
}
