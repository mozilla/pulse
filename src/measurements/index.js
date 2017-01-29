import { storage } from 'sdk/simple-storage';
import { getMostRecentBrowserWindow } from 'sdk/window/utils';
import Logger from '../lib/log';

import AdBlocker from './ad-blocker';
import TelemetryId from './telemetry-id';

const MEASUREMENTS = [ AdBlocker, TelemetryId ];
const logger = new Logger(
  'sdk.measurements',
  getMostRecentBrowserWindow().console
);

// Passed the output from the survey, augments that data with each measurment
// in MEASUREMENTS and returns a promise resolving to a Map containing the full
// payload, ready for submission to telemetry.
export default data => {
  const survey = new Map(Object.entries(data));
  logger.log(`Collecting data for ${survey.get('id')}`);
  const tab = storage.id[survey.get('id')];
  survey.delete('id');
  return new Promise((resolve, reject) => {
    Promise
      .all(MEASUREMENTS.map(Measure => new Measure(tab, survey).getValue()))
      .then(data => resolve(new Map([ ...survey, ...data ])))
      .catch(err => reject(err));
  });
};
