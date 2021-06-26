import { SagaIterator } from 'redux-saga';
import { takeLeading, takeLatest, put } from 'redux-saga/effects';
import { AppActionsTypes } from '@enums/actions-types.enum';

import { IFetchIssueGlobalError, ISagaThrownError } from '@models/app/errors.model';
import { IGlobalState } from '@models/app/global-state.model';
import { IWalletSagaTriggerObject } from '@models/actions-results.model';

import { IWallet } from '../models/app/wallet.model';


import { _setDoneInitializingApp, _setIsLoadingWalletItems, _setWalletItems, _setTotalWalletCount ,_setWalletLoadingError, } from '@actions/app.actions';


import { SagaErrorHandler } from '@error-handlers/saga-error-handler';
import { emitNextAndComplete, throwError } from '@utils/rxjs-subject-safe-handler';

import _ from 'lodash';

function getWalletItems(state: IGlobalState): IWallet[] {
  return state.app.walletItems ?? [];
}
// -------------------

function getTotalWalletCount(state: IGlobalState): number {
  return state.app.totalWalletCount ?? 0;
}
// ----------------------------------------------------------------------------------------------

// App Sagas ----------------------------------------------------------------------------------
function* initAppStateSaga(): SagaIterator {
  yield put(_setDoneInitializingApp(true));
}
// -------------------

function* walletListSaga(sagaData: IWalletSagaTriggerObject): SagaIterator  {
  const sagaName: string = 'transactionListSaga';
  try {
    yield put(_setIsLoadingWalletItems(true));
    yield put(_setWalletItems([]));
    yield put(_setWalletLoadingError(''));

    const walletsData: IWallet[] = require('./wallets.json');

    if (walletsData && !_.isEmpty(walletsData)) {
      yield put(_setWalletItems(walletsData));
      yield put(_setTotalWalletCount(_.size(walletsData)));
      yield put(_setIsLoadingWalletItems(false));
      emitNextAndComplete(sagaData._observable, true);
    } else {
      const handledError: ISagaThrownError = handleError(new Error, 'Unexpected data format', sagaName, sagaData.showErrorAlerts, sagaData.onErrorAlertDismissal);
      yield put(_setWalletLoadingError(handledError.message));
      yield put(_setIsLoadingWalletItems(false));
      emitNextAndComplete(sagaData._observable, false);
    }
  } catch (error) {
    console.log(error);
    yield put(_setWalletLoadingError(error));
    yield put(_setIsLoadingWalletItems(false));
    yield put(_setWalletItems([]));
    yield put(_setTotalWalletCount(0));
    emitNextAndComplete(sagaData._observable, false);
    throwError(sagaData._observable, handleError((_.isError(error) ? error : new Error), error, sagaName, sagaData.showErrorAlerts, sagaData.onErrorAlertDismissal));
  }
}
// -------------------

// ---------------------------------------------------------------------------------------------

// Root App Saga -------------------------------------------------------------------------------
export function* rootAppSaga() {
  yield takeLeading(AppActionsTypes.INIT_APP_STATE_SAGA, initAppStateSaga);
  yield takeLatest(AppActionsTypes.LOAD_WALLET_LIST_SAGA , walletListSaga);

}
// ---------------------------------------------------------------------------------------------

// Error Handling ------------------------------------------------------------------------------
function handleError(stackTraceCapturer: Error, error: any, location: string, showErrorAlert?: boolean, onErrorAlertDismissal?: () => void): ISagaThrownError {
  const errorToReport: IFetchIssueGlobalError = {} as IFetchIssueGlobalError;
  return SagaErrorHandler.handleError(errorToReport, location, 'appSaga', showErrorAlert, onErrorAlertDismissal);
}

// ---------------------------------------------------------------------------------------------
