import BaseMeasurement from '../lib/measurement';

export default class Timestamp extends BaseMeasurement {
  measure(resolve) {
    this.contentScript('timestamp', resolve);
  }
}
