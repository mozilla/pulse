import BaseMeasurement from '../lib/measurement';

export default class TimerFirstPaint extends BaseMeasurement {
  measure(resolve) {
    this.contentScript('timer-first-paint', resolve);
  }
}
