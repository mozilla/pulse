import { AddonManager } from 'resource://gre/modules/AddonManager.jsm';
import BaseMeasurement from '../lib/measurement';

// This list is constructed by manually-reviewing all add-ons in the AMO
// 'Security and Privacy' category with more than 25,000 users. It is not
// guaranteed to be exhaustive.
const ADBLOCK_ADDONS = [
  // adblock-plus
  '{d10d0bf8-f5b5-c8b4-a8b2-2b9879e08c5d}',
  // ublock-origin
  'uBlock0@raymondhill.net',
  // noscript
  '{73a6fe31-595d-460b-a920-fcc0f8843232}',
  // ghostery
  'firefox@ghostery.com',
  // adblocker-ultimate
  'adblockultimate@adblockultimate.net',
  // disconnect
  '2.0@disconnect.me',
  // adguard-adblocker
  'adguardadblocker@adguard.com',
  // ublock
  '{2b10c1c8-a11f-4bad-fe9c-1c11e82cac42}',
  // adblock-for-firefox
  'jid1-NIfFY2CA8fy1tg@jetpack',
  // privacy-badger17
  'jid1-MnnxcxisBPnSXQ@jetpack',
  // ads-blocker
  '{b89efd87-232e-4829-87d2-22148919d72f}',
  // ad-aware-ad-block
  'AdBlockerLavaSoftFF@lavasoft.com',
  // adblock-lite-firefox
  'jid1-dwtFBkQjb3SIQp@jetpack',
  // umatrix
  'uMatrix@raymondhill.net',
  // Test Pilot: Tracking Protection
  'blok@mozilla.org'
];

export default class AdBlocker extends BaseMeasurement {
  measure(resolve) {
    AddonManager.getAllAddons(addons => {
      const installedAdblockers = addons.filter(addon => {
        return ADBLOCK_ADDONS.includes(addon.id) && addon.isActive;
      });
      resolve(installedAdblockers.length > 0);
    });
  }
}
