import BaseMeasurement from '../lib/measurement';

export default class TimerWindowLoad extends BaseMeasurement {
  measure(resolve) {
    this.contentScript('timer-window-load', resolve);
  }
}
