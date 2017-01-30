import BaseMeasurement from '../lib/measurement';
import system from 'sdk/system';

export default class Platform extends BaseMeasurement {
  measure(resolve) {
    resolve(system.platform);
  }
}
