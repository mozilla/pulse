import BaseMeasurement from '../lib/measurement';

export default class Protocol extends BaseMeasurement {
  measure(resolve) {
    this.contentScript('protocol', resolve);
  }
}
