import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';

import { ReduxStore } from './redux-store';
import { rootReducer } from './../reducers/index';
import { rootSaga } from './../sagas/index';

import { composeWithDevTools } from 'redux-devtools-extension';

export function initializeStore(): void {
  // MiddleWares ----------------------------------------
  const middlewares: any[] = [];
  const sagaMiddleware: SagaMiddleware<object> = createSagaMiddleware();
  middlewares.push(sagaMiddleware);

  // Enhancers Composing --------------------------------
  const enhancers: any = __DEV__ ? composeWithDevTools(applyMiddleware(...middlewares)) : compose(applyMiddleware(...middlewares));

  // Store ----------------------------------------------
  const store = createStore(
    rootReducer,
    enhancers
  );
  sagaMiddleware.run(rootSaga);

  ReduxStore.setStore(store);
}
// --------------------------------------------------------------------------------
