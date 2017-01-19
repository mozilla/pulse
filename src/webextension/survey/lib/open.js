import Logger from '../../../lib/log';

const logger = new Logger('webext.survey.open', window.console);

export default class Open {
  constructor() {
    this.className = 'open--trigger';
    this.handleClick = this.handleClick.bind(this);
    window.addEventListener('click', this.handleClick);
  }

  handleClick(evt) {
    if (evt.target.classList.contains(this.className)) {
      logger.log('Opening survey in new tab.');
      browser.tabs.create({ url: '/survey/index.html' });
    }
  }
}
