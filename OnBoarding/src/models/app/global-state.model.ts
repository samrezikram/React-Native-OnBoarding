import { ThemeName, ThemeKind } from '@enums/theme-name.enum';
import { IWallet } from './wallet.model';
export interface IGlobalState {
    app: IAppState;
    theme: IThemeState;
}

export interface IAppState {
    doneInitializing?: boolean;
    totalWalletCount?: number;
    walletItems?: IWallet[];
    isLoadingWalletItems?: boolean;
    walletLoadingError?: string;
}
export interface IThemeState {
    doneInitializing?: boolean;
    isAuto?: boolean;
    themeName?: ThemeName;
    themeKind?: ThemeKind;
}
