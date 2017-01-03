const { Logger } = require('../../../lib/log');
const logger = new Logger('survey.open', window.console);

module.exports = function Open() {
  this.className = 'open--trigger';

  window.addEventListener('click', evt => {
    if (evt.target.classList.contains(this.className)) {
      logger.log('Opening survey in new tab.');

      browser.tabs.create({
        url: '/survey/index.html'
      });
    }
  });
}
