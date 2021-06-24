import { ThemesActionsTypes } from '@enums/actions-types.enum';
import { ThemeName, ThemeKind } from '@enums/theme-name.enum';

import {
  IThemeActionResult,
  ISagaTriggerObject,
  ISetThemeSagaTriggerObject,
} from '@models/actions-results.model';

/* ------------------------------------------------------------------ */
/* ---------------------    Actions    ------------------------------ */
/* ------------------------------------------------------------------ */
/**
 *
 * @description This should only be called by a saga, not directly from a component
 */
export function _setDoneInitilizingTheme(done: boolean): IThemeActionResult {
  const result: IThemeActionResult = {
    type: ThemesActionsTypes.SET_DONE_INITIALIZING_THEME,
    payload: {
      doneInitializing: done
    }
  };
  return result;
}
// ----------------------

/**
 *
 * @description This should only be called by a saga, not directly from a component
 */
export function _setTheme(themeName: ThemeName, themeKind: ThemeKind): IThemeActionResult {
  const result: IThemeActionResult = {
    type: ThemesActionsTypes.SET_THEME,
    payload: {
      themeName: themeName,
      themeKind: themeKind
    }
  };
  return result;
}

/**
 *
 * @description This should only be called by a saga, not directly from a component
 */
export function _setIsAutoTheme(isAuto: boolean): IThemeActionResult {
  const result: IThemeActionResult = {
    type: ThemesActionsTypes.SET_IS_AUTO_THEME,
    payload: {
      isAuto: isAuto
    }
  };
  return result;
}
// ---------------------------------------------------------------------



/* ------------------------------------------------------------------ */
/* ------------------    Saga Triggers    --------------------------- */
/* ------------------------------------------------------------------ */
export function initThemeStateAsync(): ISagaTriggerObject {
  return {
    type: ThemesActionsTypes.INIT_THEME_STATE_SAGA
  };
}
// ----------------------

export function setThemeAsync(themeName: ThemeName): ISetThemeSagaTriggerObject {
  const result: ISetThemeSagaTriggerObject = {
    type: ThemesActionsTypes.SET_THEME_SAGA,
    payload: {
      themeName
    }
  };
  return result;
}
// ----------------------

export function setAutoThemeAsync(): ISagaTriggerObject {
  const result: ISagaTriggerObject = {
    type: ThemesActionsTypes.SET_AUTO_THEME_SAGA
  };
  return result;
}
// ---------------------------------------------------------------------

