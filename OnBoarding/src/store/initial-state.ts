import { IGlobalState, IAppState, IThemeState } from '@models/app/global-state.model';
import { ThemeName, ThemeKind } from '@enums/theme-name.enum';

// App State ------------------------------------
export function getInitialAppState(): IAppState  {
    return {
        doneInitializing: false,
        walletItems: [],
        isLoadingWalletItems: false,
        walletLoadingError: '',
        totalWalletCount: 0,
    };
}
// ----------------------------------------------

// Theme State ----------------------------------
export function getInitialThemeState(): IThemeState {
    return {
        doneInitializing: false,
        isAuto: false,
        themeName: ThemeName.Light,
        themeKind: ThemeKind.Light
    };
}
// ----------------------------------------------

export const initialState: IGlobalState = {
    app: getInitialAppState(),
    theme: getInitialThemeState()
};
