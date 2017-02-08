import BaseMeasurement from '../lib/measurement';

export default class TimerContentLoaded extends BaseMeasurement {
  measure(resolve) {
    this.contentScript('timer-content-loaded', resolve);
  }
}
