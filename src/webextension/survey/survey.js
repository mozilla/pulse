// eslint-disable-next-line no-unused-vars
import styles from './styles.scss';

import Init from './lib/init';
import Submit from './lib/submit';

function main() {
  window.app = { init: new Init(), submit: new Submit() };
}

if (document.readyState !== 'loading') {
  main();
} else {
  document.addEventListener('DOMContentLoaded', main);
}
