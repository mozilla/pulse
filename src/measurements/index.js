import { storage } from 'sdk/simple-storage';
import { getMostRecentBrowserWindow } from 'sdk/window/utils';
import Logger from '../lib/log';

import AdBlocker from './ad-blocker';
import Addons from './addons';
import Channel from './channel';
import ConsoleErrors from './console-errors';
import Hostname from './hostname';
import Language from './language';
import OpenTabs from './open-tabs';
import OpenWindows from './open-windows';
import Platform from './platform';
import Protocol from './protocol';
import TelemetryId from './telemetry-id';
import TimerContentLoaded from './timer-content-loaded';
import TimerFirstInteraction from './timer-first-interaction';
import TimerFirstPaint from './timer-first-paint';
import TimerWindowLoad from './timer-window-load';
import Timestamp from './timestamp';
import TrackingProtection from './tracking-protection';
import Version from './version';

const MEASUREMENTS = [
  AdBlocker,
  Addons,
  Channel,
  ConsoleErrors,
  Hostname,
  Language,
  OpenTabs,
  OpenWindows,
  Platform,
  Protocol,
  TelemetryId,
  TimerContentLoaded,
  TimerFirstInteraction,
  TimerFirstPaint,
  TimerWindowLoad,
  Timestamp,
  TrackingProtection,
  Version
];
const logger = new Logger(
  'sdk.measurements',
  getMostRecentBrowserWindow().console
);

// Passed the output from the survey, augments that data with each measurment
// in MEASUREMENTS and returns a promise resolving to a Map containing the full
// payload, ready for submission to telemetry.
export default surveyData => {
  const survey = new Map(Object.entries(surveyData));
  logger.log(`Collecting data for ${survey.get('id')}`);
  const tab = storage.id[survey.get('id')];
  survey.delete('id');
  return new Promise((resolve, reject) => {
    Promise
      .all(MEASUREMENTS.map(Measure => new Measure(tab, survey).getValue()))
      .then(data => {
        resolve(
          [ ...survey, ...data ].reduce(
            (payload, [ key, value ]) => {
              payload[key] = value;
              return payload;
            },
            {}
          )
        );
      })
      .catch(err => reject(err));
  });
};
