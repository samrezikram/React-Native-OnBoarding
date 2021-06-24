import { Subject } from 'rxjs';

import {
  IAppActionResult,
  ITransactionSagaTriggerObject,
  ISagaTriggerObject,
} from '@models/actions-results.model';
import { ITransaction } from '@models/app/transaction.model';

import { AppActionsTypes } from '@enums/actions-types.enum';


//  @description This should only be called by a saga, not directly from a component

/* ------------------------------------------------------------------ */
/* ---------------------    Actions    ------------------------------ */
/* ------------------------------------------------------------------ */
/**
 *
 * @description This should only be called by a saga, not directly from a component
 */
export function _setDoneInitilizingApp(done: boolean): IAppActionResult {
  const result: IAppActionResult = {
    type: AppActionsTypes.SET_DONE_INITIALIZING_APP,
    payload: {
      doneInitializing: done
    }
  };
  return result;
}
// ----------------------

export function _setIsLoadingTransactionItems(isLoadingTransactionItems: boolean): IAppActionResult {
  const result: IAppActionResult = {
    type: AppActionsTypes.SET_IS_LOADING_TRANSACTION_ITEMS,
    payload: {
      isLoadingTransactionItems: isLoadingTransactionItems
    }
  };
  return result;
}
// ----------------------



export function _setTransactionItems(transactionItems: ITransaction[]): IAppActionResult {
  const result: IAppActionResult = {
    type: AppActionsTypes.SET_TRANSACTION_ITEMS,
    payload: {
      transactionItems: transactionItems
    }
  };
  return result;
}
// ----------------------

export function _setTransactionLoadingError(error: string): IAppActionResult {
  const result: IAppActionResult = {
    type: AppActionsTypes.SET_TRANSACTION_LOADING_ERROR,
    payload: {
      transactionLoadingError: error
    }
  };
  return result;
}
// ----------------------

/* ------------------------------------------------------------------ */
/* ------------------    Saga Triggers    --------------------------- */
/* ------------------------------------------------------------------ */
export function loadTransactionItemsAsync(showErrorAlerts?: boolean, onErrorAlertDismissal?: () => void): ITransactionSagaTriggerObject {
  const _observable: Subject<boolean> = new Subject<boolean>();
  const result: ITransactionSagaTriggerObject = {
    type: AppActionsTypes.LOAD_TRANSACTION_LIST_SAGA,
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
