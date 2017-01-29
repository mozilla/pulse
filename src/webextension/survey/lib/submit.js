import Logger from '../../../lib/log';
import Uri from 'urijs';

const logger = new Logger('webext.survey.submit', window.console);

export default class Submit {
  constructor() {
    this.submitClass = 'submit--button';
    this.handleClick = this.handleClick.bind(this);
    window.addEventListener('click', this.handleClick);
  }

  // In addition to the actual form data, collect and pass along context
  // communicated as querystring parameters.
  getContext() {
    const context = new Uri(window.location.search).search(true);
    // Ensure that tab and window IDs are submitted as numbers.
    [ 'tab', 'window' ].forEach(key => {
      context[key] = parseInt(context[key], 10);
    });
    return context;
  }

  getFormData() {
    return { type: 'random', sentiment: 4, reason: 'slow', details: '' };
  }

  handleClick(evt) {
    if (evt.target.classList.contains(this.submitClass)) {
      const data = Object.assign(this.getFormData(), this.getContext());
      const message = JSON.stringify(data);
      logger.log('Submitting survey', message);
      browser.runtime.sendMessage(message).then(reply => {
        if (reply) {
          logger.log('Response from SDK add-on:', reply.content);
        }
      });
    }
  }
}
