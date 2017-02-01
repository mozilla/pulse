import BaseMeasurement from '../lib/measurement';
import system from 'sdk/system';

export default class Version extends BaseMeasurement {
  measure(resolve) {
    resolve(system.version);
  }
}
