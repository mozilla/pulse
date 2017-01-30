import TelemetryId from './telemetry-id';
import { getContext } from '../lib/utils';

const MEASUREMENTS = [ TelemetryId ];

// Passed the output from the survey, augments that data with each measurment
// in MEASUREMENTS and returns a promise resolving to a Map containing the full
// payload, ready for submission to telemetry.
export default survey => {
  const { tab, window } = getContext(survey.get('tab'), survey.get('window'));
  return new Promise((resolve, reject) => {
    Promise
      .all(
        MEASUREMENTS.map(Measure => new Measure(tab, window, survey).getValue())
      )
      .then(data => resolve(new Map([ ...survey, ...data ])))
      .catch(err => reject(err));
  });
};
