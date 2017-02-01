import BaseMeasurement from '../lib/measurement';
import { browserWindows } from 'sdk/windows';

export default class OpenWindows extends BaseMeasurement {
  measure(resolve) {
    resolve(browserWindows.length);
  }
}
