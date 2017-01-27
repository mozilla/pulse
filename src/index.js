import webext from 'sdk/webextension';
import { getMostRecentBrowserWindow } from 'sdk/window/utils';
import Logger from './lib/log';
import measure from './measurements';

import { setTimeout } from 'sdk/timers';

const logger = new Logger('sdk.index', getMostRecentBrowserWindow().console);

logger.log('SDK startup');

webext.startup().then(({ browser }) => {
  logger.log('WebExtension startup');
  browser.runtime.onConnect.addListener(() => {
  });
});

// Until the survey is finished, let's run measurements once on startup with
// some dummy data to make development easy.
setTimeout(
  () => {
    const survey = new Map([ [ 'fakeSurveyQuestion', 'fakeSurveyAnswer' ] ]);
    measure(survey).then(measurements => {
      logger.log(measurements);
    });
  },
  1000
);
