import BaseMeasurement from '../lib/measurement';

export default class ConsoleErrors extends BaseMeasurement {
  measure(resolve) {
    this.contentScript('console-errors', resolve);
  }
}
