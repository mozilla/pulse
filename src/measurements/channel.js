import { AppConstants } from 'resource://gre/modules/AppConstants.jsm';
import BaseMeasurement from '../lib/measurement';
import system from 'sdk/system';

export const NIGHTLY = 'nightly';
export const DEVELOPER = 'developer';
export const BETA = 'beta';
export const RELEASE = 'release';

export default class Channel extends BaseMeasurement {
  measure(resolve) {
    if (AppConstants.NIGHTLY_BUILD) {
      resolve(NIGHTLY);
    } else if (AppConstants.MOZ_DEV_EDITION) {
      resolve(DEVELOPER);
    } else if (AppConstants.RELEASE_OR_BETA && system.version.includes('b') ) {
      resolve(BETA);
    } else {
      resolve(RELEASE);
    }
  }
}
