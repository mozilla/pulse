import Logger from '../../../lib/log';

const logger = new Logger('webext.survey.submit', window.console);

export default class Submit {
  constructor() {
    this.submitClass = 'submit--button';
    this.handleClick = this.handleClick.bind(this);
    window.addEventListener('click', this.handleClick);
  }

  getFormData() {
    return {
      id: window.app.init.uuid,
      type: 'random',
      sentiment: 4,
      reason: 'slow',
      details: ''
    };
  }

  handleClick(evt) {
    if (evt.target.classList.contains(this.submitClass)) {
      const message = { type: 'submission', payload: this.getFormData() };
      logger.log('Submitting survey', message);
      browser.runtime.sendMessage(message).then(reply => {
        if (reply) {
          logger.log('Response from SDK add-on:', reply.content);
        }
      });
    }
  }
}
