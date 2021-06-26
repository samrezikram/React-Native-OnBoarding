import { Subject } from 'rxjs';

import {
  IAppActionResult,
  IWalletSagaTriggerObject,
  ISagaTriggerObject,
} from '@models/actions-results.model';
import { IWallet } from '@models/app/wallet.model';

import { AppActionsTypes } from '@enums/actions-types.enum';


//  @description This should only be called by a saga, not directly from a component

/* ------------------------------------------------------------------ */
/* ---------------------    Actions    ------------------------------ */
/* ------------------------------------------------------------------ */
/**
 *
 * @description This should only be called by a saga, not directly from a component
 */
export function _setDoneInitializingApp(done: boolean): IAppActionResult {
  const result: IAppActionResult = {
    type: AppActionsTypes.SET_DONE_INITIALIZING_APP,
    payload: {
      doneInitializing: done
    }
  };
  return result;
}
// ----------------------

export function _setIsLoadingWalletItems(isLoadingWalletItems: boolean): IAppActionResult {
  const result: IAppActionResult = {
    type: AppActionsTypes.SET_IS_LOADING_WALLET_ITEMS,
    payload: {
      isLoadingWalletItems: isLoadingWalletItems
    }
  };
  return result;
}
// ----------------------

export function _setTotalWalletCount(totalWalletCount: number): IAppActionResult {
  const result: IAppActionResult = {
    type: AppActionsTypes.SET_TOTAL_WALLET_COUNT,
    payload: {
      totalWalletCount: totalWalletCount
    }
  };
  return result;
}
// ----------------------



export function _setWalletItems(walletItems: IWallet[]): IAppActionResult {
  const result: IAppActionResult = {
    type: AppActionsTypes.SET_WALLET_ITEMS,
    payload: {
      walletItems: walletItems
    }
  };
  return result;
}
// ----------------------

export function _setWalletLoadingError(error: string): IAppActionResult {
  const result: IAppActionResult = {
    type: AppActionsTypes.SET_WALLET_LOADING_ERROR,
    payload: {
      walletLoadingError: error
    }
  };
  return result;
}
// ----------------------

/* ------------------------------------------------------------------ */
/* ------------------    Saga Triggers    --------------------------- */
/* ------------------------------------------------------------------ */
export function loadWalletItemsAsync(showErrorAlerts?: boolean, onErrorAlertDismissal?: () => void): IWalletSagaTriggerObject {
  const _observable: Subject<boolean> = new Subject<boolean>();
  const result: IWalletSagaTriggerObject = {
    type: AppActionsTypes.LOAD_WALLET_LIST_SAGA,
    _observable: _observable,
    promise: _observable.toPromise(),
    payload: {
    },
    showErrorAlerts: showErrorAlerts,
    onErrorAlertDismissal: onErrorAlertDismissal
  };
  return result;
}
// ---------------------------------------------------------------------




/* ------------------------------------------------------------------ */
/* ------------------    Saga Triggers    --------------------------- */
/* ------------------------------------------------------------------ */
export function initAppStateAsync(): ISagaTriggerObject {
  return {
    type: AppActionsTypes.INIT_APP_STATE_SAGA
  };
}
// ----------------------
