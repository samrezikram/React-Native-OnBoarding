import { SagaIterator } from 'redux-saga';
import { takeLeading, takeLatest, put } from 'redux-saga/effects';
import { AppActionsTypes } from '@enums/actions-types.enum';

import { IFetchIssueGlobalError, ISagaThrownError } from '@models/app/errors.model';
import { IGlobalState } from '@models/app/global-state.model';
import { ITransactionSagaTriggerObject } from '@models/actions-results.model';

import { ITransaction } from './../models/app/transaction.model';


import { _setDoneInitilizingApp, _setIsLoadingTransactionItems, _setTransactionItems, _setTransactionLoadingError, } from '@actions/app.actions';


import { SagaErrorHandler } from '@error-handlers/saga-error-handler';
import { emitNextAndComplete, throwError } from '@utils/rxjs-subject-safe-handler';

import _ from 'lodash';
import moment from 'moment';

function getTransactionItems(state: IGlobalState): ITransaction[] {
  return state.app.transactionItems ?? [];
}
// -------------------

function getTotalTransactionsCount(state: IGlobalState): number {
  return state.app.totalTransactionCount ?? 0;
}
// ----------------------------------------------------------------------------------------------

// App Sagas ----------------------------------------------------------------------------------
function* initAppStateSaga(): SagaIterator {
  yield put(_setDoneInitilizingApp(true));
}
// -------------------

function* transactionListSaga(sagaData: ITransactionSagaTriggerObject): SagaIterator  {
  const sagaName: string = 'transactionListSaga';
  try {
    yield put(_setIsLoadingTransactionItems(true));
    yield put(_setTransactionItems([]));
    yield put(_setTransactionLoadingError(''));

    const transactionData: ITransaction[] = require('./payment-list.json');


    if (transactionData && !_.isEmpty(transactionData)) {
      yield put(_setTransactionItems(transactionData));
      yield put(_setIsLoadingTransactionItems(false));
      emitNextAndComplete(sagaData._observable, true);
    } else {
      const handledError: ISagaThrownError = handleError(new Error, 'Unexpected data format', sagaName, sagaData.showErrorAlerts, sagaData.onErrorAlertDismissal);
      yield put(_setTransactionLoadingError(handledError.message));
      yield put(_setIsLoadingTransactionItems(false));
      emitNextAndComplete(sagaData._observable, false);
    }
  } catch (error) {
    console.log(error);
    yield put(_setTransactionLoadingError(error));
    yield put(_setIsLoadingTransactionItems(false));
    yield put(_setTransactionItems([]));
    emitNextAndComplete(sagaData._observable, false);
    throwError(sagaData._observable, handleError((_.isError(error) ? error : new Error), error, sagaName, sagaData.showErrorAlerts, sagaData.onErrorAlertDismissal));
  }
}
// -------------------

// ---------------------------------------------------------------------------------------------

// Root App Saga -------------------------------------------------------------------------------
export function* rootAppSaga() {
  yield takeLeading(AppActionsTypes.INIT_APP_STATE_SAGA, initAppStateSaga);
  yield takeLatest(AppActionsTypes.LOAD_TRANSACTION_LIST_SAGA , transactionListSaga);

}
// ---------------------------------------------------------------------------------------------

// Error Handling ------------------------------------------------------------------------------
function handleError(stackTraceCapturer: Error, error: any, location: string, showErrorAlert?: boolean, onErrorAlertDismissal?: () => void): ISagaThrownError {
  const errorToReport: IFetchIssueGlobalError = {} as IFetchIssueGlobalError;
  return SagaErrorHandler.handleError(errorToReport, location, 'appSaga', showErrorAlert, onErrorAlertDismissal);
}
// ---------------------------------------------------------------------------------------------
