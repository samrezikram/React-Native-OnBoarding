import { initialMode, eventEmitter } from 'react-native-dark-mode';

import { ReduxStore } from '@store/redux-store';

import { ThemeName, ThemeKind } from '@enums/theme-name.enum';

import { _setTheme } from '@actions/theme.actions';

import { setDefaultNavigationOptionsPerTheme } from '@navigation/default-navigation-options';

class OSThemeListener {

  private static instance: OSThemeListener;

  private appIsSubscribed: boolean = false;
  public currentOSThemeName: ThemeName = initialMode == 'light' ? ThemeName.Light : ThemeName.Blue;

  private constructor() {
    this.runListener();
  }

  // Singleton Handling ----------------------------------------------------
  static _getInstance(): OSThemeListener {
    if (!OSThemeListener.instance) {
      OSThemeListener.instance = new OSThemeListener();
    }
    return OSThemeListener.instance;
  }
  // -----------------------------------------------------------------------

  // Private Methods -------------------------------------------------------
  private runListener(): void {
    eventEmitter.on('currentModeChanged', (newMode: 'light' | 'dark') => {
      this.currentOSThemeName = newMode == 'light' ? ThemeName.Light : ThemeName.Blue;
      const currentThemeKind: ThemeKind = this.currentOSThemeName == ThemeName.Light ? ThemeKind.Light : ThemeKind.Dark;
      if (this.appIsSubscribed) {
        ReduxStore.store.dispatch(_setTheme(this.currentOSThemeName, currentThemeKind));
        setDefaultNavigationOptionsPerTheme(this.currentOSThemeName);
      }
    });
  }
  // -----------------------------------------------------------------------

  // Public Methods --------------------------------------------------------
  public subscribeToOSThemeChanges(): void {
    this.appIsSubscribed = true;
  }
  // --------------------

  public unSubscribeToOSThemeChanges(): void {
    this.appIsSubscribed = false;
  }
  // -----------------------------------------------------------------------
}

export const OSThemeListenerService = OSThemeListener._getInstance();
