import { get } from 'sdk/preferences/service';
import BaseMeasurement from '../lib/measurement';

export default class TelemetryId extends BaseMeasurement {
  measure(resolve) {
    resolve(get('toolkit.telemetry.cachedClientID'));
  }
}
