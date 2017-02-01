import { AddonManager } from 'resource://gre/modules/AddonManager.jsm';
import BaseMeasurement from '../lib/measurement';

export default class Addons extends BaseMeasurement {
  measure(resolve) {
    AddonManager.getAllAddons(addons => {
      resolve(
        addons
          .filter(addon => addon.isActive)
          .map(addon => addon.id)
      );
    });
  }
}
