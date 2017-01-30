import BaseMeasurement from '../lib/measurement';

export default class Hostname extends BaseMeasurement {
  measure(resolve) {
    this.contentScript('hostname', resolve);
  }
}
