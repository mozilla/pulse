import BaseMeasurement from '../lib/measurement';

export default class TimerFirstInteraction extends BaseMeasurement {
  measure(resolve) {
    this.contentScript('timer-first-interaction', resolve);
  }
}
