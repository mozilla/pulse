import HttpObserver from '../lib/http-observer';
import PageAction from '../lib/page-action';
import SurveyUrl from '../lib/survey-url';

window.app = {
  httpObserver: new HttpObserver(),
  pageAction: new PageAction(),
  surveyUrl: new SurveyUrl()
};
