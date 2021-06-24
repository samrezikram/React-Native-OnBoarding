import { Store } from 'redux';
import { IGlobalState } from '@models/app/global-state.model';

class ReduxStoreClass {

  private static instance: ReduxStoreClass;
  public store: Store<IGlobalState, any> = undefined as any;

  private constructor() {}

  // Singleton Handling ----------------------------------------------------------
  static _getInstance(): ReduxStoreClass {
    if (!ReduxStoreClass.instance) {
      ReduxStoreClass.instance = new ReduxStoreClass();
    }
    return ReduxStoreClass.instance;
  }
  // -----------------------------------------------------------------------------

  // Set Store -------------------------------------------------------------------
  public setStore(store: Store<IGlobalState, any>): void {
    if (!this.store) {
      this.store = store;
    } else {
      throw new Error('Redux Store is already initilized');
    }
  }
  // -----------------------------------------------------------------------------
}

export const ReduxStore = ReduxStoreClass._getInstance();
