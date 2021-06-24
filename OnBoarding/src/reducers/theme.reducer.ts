import { ThemesActionsTypes } from '@enums/actions-types.enum';
import { IThemeActionResult } from '@models/actions-results.model';
import { IThemeState } from '@models/app/global-state.model';

import { initialState } from '@store/initial-state';

export function themeReducer(state: IThemeState = initialState.theme, action: IThemeActionResult): IThemeState {
  switch (action.type) {

    // ----------------------------------------------------------
    case ThemesActionsTypes.SET_DONE_INITIALIZING_THEME:
      return {
        ...state,
        doneInitializing: action.payload.doneInitializing
      } as IThemeState;

    // ----------------------------------------------------------
    case ThemesActionsTypes.SET_THEME:
      return {
        ...state,
        themeName: action.payload.themeName,
        themeKind: action.payload.themeKind
      } as IThemeState;

    // ----------------------------------------------------------
    case ThemesActionsTypes.SET_IS_AUTO_THEME:
      return {
        ...state,
        isAuto: action.payload.isAuto
      } as IThemeState;

    default:
      return state;
  }
}
