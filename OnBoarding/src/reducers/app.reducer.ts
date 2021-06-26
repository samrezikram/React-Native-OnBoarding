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
    case AppActionsTypes.SET_WALLET_ITEMS:
      return {
        ...state,
        walletItems: action.payload.walletItems
      } as IAppState;

    // ----------------------------------------------------------
    case AppActionsTypes.SET_IS_LOADING_WALLET_ITEMS:
      return {
        ...state,
        isLoadingWalletItems: action.payload.isLoadingWalletItems
      } as IAppState;
    // ----------------------------------------------------------

    case AppActionsTypes.SET_TOTAL_WALLET_COUNT:
      return {
        ...state,
        totalWalletCount: action.payload.totalWalletCount
      } as IAppState;
    // ----------------------------------------------------------

    case AppActionsTypes.SET_WALLET_LOADING_ERROR:
      return {
        ...state,
        walletLoadingError: action.payload.walletLoadingError
      } as IAppState;
    // ----------------------------------------------------------

    
    default:
      return state;
  }
}
