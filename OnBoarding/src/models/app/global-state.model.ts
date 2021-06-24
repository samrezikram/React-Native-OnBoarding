import { ThemeName, ThemeKind } from '@enums/theme-name.enum';
import { ITransaction } from './transaction.model';
export interface IGlobalState {
    app: IAppState;
    theme: IThemeState;
}

export interface IAppState {
    doneInitializing?: boolean;
    totalTransactionCount?: number;
    transactionItems?: ITransaction[];
    isLoadingTransactionItems?: boolean;
    transactionLoadingError?: string;
}
export interface IThemeState {
    doneInitializing?: boolean;
    isAuto?: boolean;
    themeName?: ThemeName;
    themeKind?: ThemeKind;
}
