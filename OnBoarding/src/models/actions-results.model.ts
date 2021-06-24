import { Subject } from 'rxjs';
import { GlobalActionsTypes, AppActionsTypes, ThemesActionsTypes } from '@enums/actions-types.enum';
import { IAppState, IThemeState } from './app/global-state.model';
import { ThemeName } from '@enums/theme-name.enum';


// Global ------------------------------------------------------------------------------------------------------
// Actions ---------------
export interface IGlobalActionResult {
  type: GlobalActionsTypes;
}
// -------------------------------------------------------------------------------------------------------------

// App ---------------------------------------------------------------------------------------------------------
// Actions ---------------
export interface IAppActionResult {
  type: AppActionsTypes;
  payload: IAppState;
}

// Sagas -----------------
// ----------
export interface ITransactionSagaTriggerObject extends ISagaTriggerObject {
  _observable: Subject<boolean>;
  promise: Promise<boolean>;
  payload: {
  }
}



// -------------------------------------------------------------------------------------------------------------

// Themes ------------------------------------------------------------------------------------------------------
// Actions ---------------
export interface IThemeActionResult {
  type: ThemesActionsTypes;
  payload: IThemeState;
}

// Sagas -----------------
export interface ISetThemeSagaTriggerObject extends ISagaTriggerObject {
  payload: {
    themeName: ThemeName;
  }
}

// Saga Trigger ------------------------------------------------------------------------------------------------
export interface ISagaTriggerObject {
  type: GlobalActionsTypes | AppActionsTypes | ThemesActionsTypes;
  showErrorAlerts?: boolean;
  onErrorAlertDismissal?: () => void;
}
// -------------------------------------------------------------------------------------------------------------
