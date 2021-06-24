// Global Actions Types ----------------------------------------------------------------
export enum GlobalActionsTypes {
  // Actions ----
  RESET_GLOBAL_STATE = 'reset_global_state',

  // Sagas ------
  RESET_APPLICATION_SAGA = 'reset_application_state_saga',
  RESET_GLOBAL_STATE_SAGA = 'reset_global_state_saga'
}
// -------------------------------------------------------------------------------------

// App Actions Types -------------------------------------------------------------------
export enum AppActionsTypes {
  // Actions ----
  SET_IS_LOADING_TRANSACTION_ITEMS = 'set_is_loading_transaction_items',
  SET_TOTAL_TRANSACTION_COUNT = 'set_total_transaction_count',
  SET_TRANSACTION_ITEMS = 'set_transaction_items',
  SET_TRANSACTION_LOADING_ERROR = 'set_trnsaction_loading_error',

  // Sagas ------
  INIT_APP_STATE_SAGA = 'init_app_state_saga',
  SET_DONE_INITIALIZING_APP = 'set_done_initializing_app',
  LOAD_TRANSACTION_LIST_SAGA = 'load_transaction_list_saga'
}
// -------------------------------------------------------------------------------------

// Themes Actions Types ----------------------------------------------------------------
export enum ThemesActionsTypes {
  // Actions ----
  SET_DONE_INITIALIZING_THEME = 'set_done_initializing_theme',
  SET_THEME = 'set_theme',
  SET_IS_AUTO_THEME = 'set_is_auto_theme',

  // Sagas ------
  INIT_THEME_STATE_SAGA = 'init_theme_state_saga',
  SET_THEME_SAGA = 'set_theme_saga',
  SET_AUTO_THEME_SAGA = 'set_auto_theme_saga'
}
// -------------------------------------------------------------------------------------
