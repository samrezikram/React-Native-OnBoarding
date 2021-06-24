import { GlobalActionsTypes } from '@enums/actions-types.enum';
import { combineReducers, Reducer } from 'redux';

import { IGlobalState } from '@models/app/global-state.model';

import { initialState } from '@store/initial-state';

import { appReducer } from './app.reducer';
import { themeReducer } from './theme.reducer';

const combinedReducers: Reducer<IGlobalState, any> = combineReducers({
  app: appReducer,
  theme: themeReducer,
});

const rootReducerConstruct = (state: IGlobalState, action: any) => {
  if (action && action.type == GlobalActionsTypes.RESET_GLOBAL_STATE) {
    state.app = initialState.app;

  }
  return combinedReducers(state, action);
};

export const rootReducer: Reducer<IGlobalState, any> = rootReducerConstruct as Reducer<IGlobalState, any>;
