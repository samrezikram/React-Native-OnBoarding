import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';


import _ from 'lodash';

export class DeviceApplicationInfoUtil {

  private constructor() {}
    
  public static isOSCapableOfAutoTheming(): boolean {
    const rawOSVersion: string = DeviceInfo.getSystemVersion();
    const osVersion: number = parseFloat(rawOSVersion);
    return Platform.select({
      ios: osVersion >= 13,
      android: osVersion >= 10,
      default: false
    });
  }
  // -----------------------
  // ------------------------------------------------------------------
}
// --------------------------------------------------------------------
