import { SagaIterator } from 'redux-saga';
import { takeLeading, takeLatest, put, call, select } from 'redux-saga/effects';
import { initialMode as osThemeInitialMode } from 'react-native-dark-mode';

import { IGlobalState } from '@models/app/global-state.model';

import { ThemeKind, ThemeName } from '@enums/theme-name.enum';
import { LocalStorageKey } from '@enums/local-storage-keys.enum';

import { _setDoneInitilizingTheme, _setIsAutoTheme, _setTheme } from '@actions/theme.actions';

import { LocalStorageService } from '@services/local-storage/local-storage.service';
import { OSThemeListenerService } from '@services/os-theme-listener/os-theme-listener.service';

import { setDefaultNavigationOptionsPerTheme } from '@navigation/default-navigation-options';


import { DeviceApplicationInfoUtil } from '@utils/device-application-info.util';

import _ from 'lodash';
import { SagaErrorHandler } from '@error-handlers/saga-error-handler';
import { ISagaThrownError } from '@models/app/errors.model';
import { ThemesActionsTypes } from '@enums/actions-types.enum';
import { ISagaTriggerObject, ISetThemeSagaTriggerObject } from '@models/actions-results.model';

// Selectors ------------------------------------------------------------------------------------
function getCurrentThemeName(state: IGlobalState): ThemeName {
  return state.theme.themeName || ThemeName.Light;
}
// -------------------

function getCurrentThemeKind(state: IGlobalState): ThemeKind {
  return state.theme.themeKind || ThemeKind.Light;
}
// ----------------------------------------------------------------------------------------------

function* initThemeState(): SagaIterator {
  const sagaName: string = 'initThemeState';
  try {
    const osIsCapableOfAutoTheming: boolean = DeviceApplicationInfoUtil.isOSCapableOfAutoTheming();
    const themeIsAuto: boolean = yield call(LocalStorageService.getItem.bind(LocalStorageService), LocalStorageKey.THEME_IS_AUTO, true);
    const currentThemeName: ThemeName = yield call(LocalStorageService.getItem.bind(LocalStorageService), LocalStorageKey.APP_THEME_NAME);    
    const shouldForceAutoTheming: boolean = (themeIsAuto == undefined || themeIsAuto == null) && osIsCapableOfAutoTheming;
    if (shouldForceAutoTheming) {
      const osTheme: ThemeName = osThemeInitialMode == 'light' ? ThemeName.Light : ThemeName.Blue;
      const themeKind: ThemeKind = osTheme == ThemeName.Light ? ThemeKind.Light : ThemeKind.Dark;
      yield call(LocalStorageService.setItem.bind(LocalStorageService), LocalStorageKey.THEME_IS_AUTO, true);
      yield call(LocalStorageService.setItem.bind(LocalStorageService), LocalStorageKey.APP_THEME_NAME, osTheme);
      yield put(_setIsAutoTheme(true));
      yield put(_setTheme(osTheme, themeKind));
      OSThemeListenerService.subscribeToOSThemeChanges();
      setDefaultNavigationOptionsPerTheme(osTheme);
    } else {
      if (themeIsAuto) {
        const osTheme: ThemeName = osThemeInitialMode == 'light' ? ThemeName.Light : ThemeName.Blue;
        const themeKind: ThemeKind = osTheme == ThemeName.Light ? ThemeKind.Light : ThemeKind.Dark;
        yield put(_setIsAutoTheme(true));
        yield put(_setTheme(osTheme, themeKind));
        OSThemeListenerService.subscribeToOSThemeChanges();
        setDefaultNavigationOptionsPerTheme(osTheme);
      } else {
        yield put(_setIsAutoTheme(themeIsAuto || false));
        OSThemeListenerService.unSubscribeToOSThemeChanges();
        if (currentThemeName && Object.values(ThemeName).includes(currentThemeName)) {
          const themeKind: ThemeKind = currentThemeName == ThemeName.Light ? ThemeKind.Light : ThemeKind.Dark;
          yield put(_setTheme(currentThemeName, themeKind));
          setDefaultNavigationOptionsPerTheme(currentThemeName);
        } else {
          yield call(LocalStorageService.setItem.bind(LocalStorageService), LocalStorageKey.APP_THEME_NAME, ThemeName.Light);
          yield put(_setTheme(ThemeName.Light, ThemeKind.Light));
          setDefaultNavigationOptionsPerTheme(ThemeName.Light);
        }
      }
    }
    yield put(_setDoneInitilizingTheme(true));
  } catch (error) {
    yield put(_setTheme(ThemeName.Light, ThemeKind.Light));
    yield put(_setIsAutoTheme(false));
    setDefaultNavigationOptionsPerTheme(ThemeName.Light);
    yield put(_setDoneInitilizingTheme(true));
    handleError(error, 'initThemeStateSaga@themeSaga');
  }
}

function* setThemeSaga(sagaData: ISetThemeSagaTriggerObject): SagaIterator  {
  const currentThemeName: ThemeName = yield select(getCurrentThemeName);
  const currentThemeKind: ThemeKind = yield select(getCurrentThemeKind);
  try {
    if (sagaData && sagaData.payload && sagaData.payload.themeName && Object.values(ThemeName).includes(sagaData.payload.themeName)) {
      const themeName: ThemeName = sagaData.payload.themeName;
      const themeKind: ThemeKind = themeName === ThemeName.Light ? ThemeKind.Light : ThemeKind.Dark;
      if (themeName != currentThemeName) {
        yield put(_setTheme(themeName, themeKind));
        yield call(LocalStorageService.setItem.bind(LocalStorageService), LocalStorageKey.APP_THEME_NAME, themeName);
      }
    } else {
      if (Object.values(ThemeName).includes(currentThemeName) && Object.values(ThemeKind).includes(currentThemeKind)) {
        yield call(LocalStorageService.setItem.bind(LocalStorageService), LocalStorageKey.APP_THEME_NAME, currentThemeName);
        yield put(_setTheme(currentThemeName, currentThemeKind));
      } else {
        yield call(LocalStorageService.setItem.bind(LocalStorageService), LocalStorageKey.APP_THEME_NAME, ThemeName.Light);
        yield put(_setTheme(ThemeName.Light, ThemeKind.Light));
      }
    }
    OSThemeListenerService.unSubscribeToOSThemeChanges();
    yield put(_setIsAutoTheme(false));
    yield call(LocalStorageService.setItem.bind(LocalStorageService), LocalStorageKey.THEME_IS_AUTO, false);
  } catch (error) {
    if (Object.values(ThemeName).includes(currentThemeName) && Object.values(ThemeKind).includes(currentThemeKind)) {
      yield put(_setTheme(currentThemeName, currentThemeKind));
    } else {
      yield put(_setTheme(ThemeName.Light, ThemeKind.Light));
    }
    OSThemeListenerService.unSubscribeToOSThemeChanges();
    yield put(_setIsAutoTheme(false));
    handleError(error, 'setThemeSaga@themeSaga');
  }
  const finalThemeName: ThemeName = yield select(getCurrentThemeName);
  setDefaultNavigationOptionsPerTheme(finalThemeName);
}
// -------------------

function* setAutoThemeSaga(sagaData: ISagaTriggerObject): SagaIterator  {
  const osTheme: ThemeName = OSThemeListenerService.currentOSThemeName;
  yield call(LocalStorageService.setItem.bind(LocalStorageService), LocalStorageKey.THEME_IS_AUTO, true);
  yield put(_setIsAutoTheme(true));
  yield put(_setTheme(osTheme, osTheme == ThemeName.Light ? ThemeKind.Light : ThemeKind.Dark));
  OSThemeListenerService.subscribeToOSThemeChanges();
  setDefaultNavigationOptionsPerTheme(osTheme);
}
// ---------------------------------------------------------------------------------------------


// Root Theme Saga -----------------------------------------------------------------------------
export function* rootThemeSaga() {
  yield takeLeading(ThemesActionsTypes.INIT_THEME_STATE_SAGA, initThemeState);
  yield takeLatest(ThemesActionsTypes.SET_THEME_SAGA, setThemeSaga);
  yield takeLeading(ThemesActionsTypes.SET_AUTO_THEME_SAGA, setAutoThemeSaga);
}
// ---------------------------------------------------------------------------------------------


// Error Handling ------------------------------------------------------------------------------
function handleError(error: any, location: string, showErrorAlert?: boolean, onErrorAlertDismissal?: () => void): ISagaThrownError {
  return SagaErrorHandler.handleError(error, location, 'themeSaga', showErrorAlert, onErrorAlertDismissal);
}