import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { GlobalConfig } from '@config/global.config';

import _ from 'lodash';

export class DeviceApplicationInfoUtil {

   private static packageName: string;
  private static systemMajorVersion: number | undefined;

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
