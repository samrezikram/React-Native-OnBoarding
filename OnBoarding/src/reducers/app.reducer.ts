import { AppActionsTypes } from '@enums/actions-types.enum';
import { IAppActionResult } from '@models/actions-results.model';
import { IAppState } from '@models/app/global-state.model';

import { initialState } from '@store/initial-state';

export function appReducer(state: IAppState = initialState.app, action: IAppActionResult): IAppState {
  switch (action.type) {

    case AppActionsTypes.SET_DONE_INITIALIZING_APP:
      return {
        ...state,
        doneInitializing: action.payload.doneInitializing
      } as IAppState;
    // ----------------------------------------------------------
    case AppActionsTypes.SET_TRANSACTION_ITEMS:
      return {
        ...state,
        transactionItems: action.payload.transactionItems
      } as IAppState;

    // ----------------------------------------------------------
    case AppActionsTypes.SET_IS_LOADING_TRANSACTION_ITEMS:
      return {
        ...state,
        isLoadingTransactionItems: action.payload.isLoadingTransactionItems
      } as IAppState;
    // ----------------------------------------------------------

    case AppActionsTypes.SET_TOTAL_TRANSACTION_COUNT:
      return {
        ...state,
        totalTransactionCount: action.payload.totalTransactionCount
      } as IAppState;
    // ----------------------------------------------------------

    case AppActionsTypes.SET_TRANSACTION_LOADING_ERROR:
      return {
        ...state,
        transactionLoadingError: action.payload.transactionLoadingError
      } as IAppState;
    // ----------------------------------------------------------

    
    default:
      return state;
  }
}
