import { Platform } from 'react-native';
import { Navigation, Options } from 'react-native-navigation';


import _ from 'lodash';
import { ThemeName } from '@enums/theme-name.enum';
import { Themes } from '@themes/index';
import { INavigationHistory, INavigationHistoryItem } from '@models/navigation-history.model';
import { Navigator } from './navigator';

const platformIsAndroid: boolean = Platform.OS == 'android';

let defaultNavigationOptions: Options = {
  statusBar: {
    drawBehind: false,
    visible: true,
    style: platformIsAndroid ? 'dark' : undefined,
    backgroundColor: 'white',
  },
  topBar: {
    visible: false,
    drawBehind: true
  },
  layout: {
    backgroundColor: '#FFFFFF',
    componentBackgroundColor: 'transparent',
    orientation: ['portrait'],
    direction: 'ltr'
  },
  modal: {
    swipeToDismiss: false
  }
};
// -------------------------

export function getDefaultNavigationOptions(): Options {
  return defaultNavigationOptions;
}
// -------------------------

export function setDefaultNavigationOptions(): void {
  Navigation.setDefaultOptions(defaultNavigationOptions);
}
// -------------------------

export function setDefaultNavigationOptionsPerTheme(themeName: ThemeName): void {
  const defaultOptions: Options = getDefaultNavigationOptions();
  const themePropForBackground: string = themeName == ThemeName.Light ? 'color-basic-100' : 'color-basic-800';
  const themePropForStatusBar: string = themeName == ThemeName.Light ? 'color-basic-100' : 'color-basic-900';
  const newOptions: Options = {
    statusBar: {
      ...defaultOptions.statusBar,
      style: platformIsAndroid ? (themeName == ThemeName.Light ? 'dark' : 'light') : undefined,
      backgroundColor: Themes[themeName][themePropForStatusBar]
    },
    topBar: {
      ...defaultOptions.topBar
    },
    layout: {
      ...defaultOptions.layout,
      backgroundColor: Themes[themeName][themePropForBackground]
    },
    modal: {
      ...defaultOptions.modal
    }
  };
  Navigation.setDefaultOptions(newOptions);
  if (platformIsAndroid) { // Android have problem updating status bar colors using StatusBar component, so it's omitted from themeHoc, and updated only here
    try {
      const navigationHistory: INavigationHistory = Navigator.getNavigationHistory();
      _.each(navigationHistory.stack, (item: INavigationHistoryItem) => {
        Navigation.mergeOptions(item.id, newOptions);
      });
    } catch (e) {}
  }
}
// -----------------------------------------------------------------------------------------------------
