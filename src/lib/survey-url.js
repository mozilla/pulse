import Uri from 'urijs';
import { sendMessage } from '../webextension/lib/util';

export default class SurveyUrl {
  constructor() {
    this.url = new Uri(window.location.href)
      .pathname('/survey/index.html')
      .query({})
      .toString();
    sendMessage('survey-url', this.url);
  }
}
