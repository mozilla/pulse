import BaseMeasurement from '../lib/measurement';
import tabs from 'sdk/tabs';

export default class OpenTabs extends BaseMeasurement {
  measure(resolve) {
    resolve(tabs.length);
  }
}
