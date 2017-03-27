import { Cc, Ci } from 'chrome';
import { Services } from 'resource://gre/modules/Services.jsm';
import { get as getPreference } from 'sdk/preferences/service';

export function e10sStatus() {
  try {
    let e10sStatus = Cc['@mozilla.org/supports-PRUint64;1'].createInstance(
      Ci.nsISupportsPRUint64
    );
    let appinfo = Services.appinfo.QueryInterface(Ci.nsIObserver);
    appinfo.observe(e10sStatus, 'getE10SBlocked', '');
    return e10sStatus.data;
  } catch (e) {
    return -1;
  }
}

export function e10sProcessCount() {
  return getPreference('dom.ipc.processCount', null);
}
