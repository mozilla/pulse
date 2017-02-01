import BaseMeasurement from '../lib/measurement';

export default class Language extends BaseMeasurement {
  measure(resolve) {
    this.contentScript('language', resolve);
  }
}
