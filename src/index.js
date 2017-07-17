/*
Pulse has graduated, and the final version uninstalls itself.

To see the final version that was shipped to users, browse the 1.1.2 tag in the
repository on GitHub:

https://github.com/mozilla/pulse/tree/1.1.2
*/

import { Cu } from 'chrome';
import { getMostRecentBrowserWindow } from 'sdk/window/utils';
import Logger from './lib/log';

const { AddonManager } = Cu.import('resource://gre/modules/AddonManager.jsm');
const logger = new Logger('sdk.index', getMostRecentBrowserWindow().console);

logger.log('Uninstalling Pulse. Thanks for the good times!')
AddonManager.getAddonByID('pulse@mozilla.com', addon => {
  addon.uninstall();
});
