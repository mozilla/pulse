import Logger from '../../../lib/log';
import uuid from 'uuid';

const logger = new Logger('webext.survey.init', window.console);

export default class Init {
  constructor() {
    this.uuid = uuid();
    browser.runtime.sendMessage({ type: 'id', payload: this.uuid }).then(() => {
      logger.log('Survey initialized with ID', this.uuid);
    });
  }
}
