import BaseMeasurement from '../lib/measurement';
import { get } from 'sdk/preferences/service';
import { isPrivate } from 'sdk/private-browsing';

export default class TrackingProtection extends BaseMeasurement {
  measure(resolve) {
    resolve(
      isPrivate(this.tab)
        ? get('privacy.trackingprotection.pbmode.enabled')
        : get('privacy.trackingprotection.enabled')
    );
  }
}
