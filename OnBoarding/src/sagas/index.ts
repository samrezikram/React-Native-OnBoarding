import { all } from 'redux-saga/effects';
import { rootAppSaga } from './app.saga';
import { rootThemeSaga } from './theme.saga';


export function* rootSaga() {
  yield all([
    rootAppSaga(),
    rootThemeSaga(),
  ]);
}
