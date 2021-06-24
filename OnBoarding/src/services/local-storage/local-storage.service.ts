import AsyncStorage from '@react-native-community/async-storage';

import { IHandledError, IGenericError } from '@models/app/errors.model';

import { ErrorSource } from '@enums/error-sources.enum';
import { LocalStorageKey } from '@enums/local-storage-keys.enum';

import { safelyStringifyValueForLocalStorage, safelyParseValueFromLocalStorage } from '@utils/value-stringifier-parser.util';

import _ from 'lodash';

type KeyValPair = [LocalStorageKey, any];

class LocalStorage {

  private static instance: LocalStorage;

  private constructor() {}

  // Singleton Handling ----------------------------------------------------------
  static _getInstance(): LocalStorage {
    if (!LocalStorage.instance) {
      LocalStorage.instance = new LocalStorage();
    }
    return LocalStorage.instance;
  }
  // -----------------------------------------------------------------------------

  // Public Async Methods --------------------------------------------------------
  /**
   * @param key String
   * @param returnParsed Boolean
   * @returns Promise<any>
   */
  public async getItem(key: LocalStorageKey, returnedParsed?: boolean): Promise<any> {
    return AsyncStorage.getItem(key as any).then((value: string | null) => {
      return returnedParsed ? safelyParseValueFromLocalStorage(value) : value;
    }).catch((error: IGenericError | any) => {
      return this.handleAsyncStorageError(error);
    });
  }
  // --------------------

  /**
   * @param key String
   * @param value any
   * @returns Promise<void>
   */
  public async setItem(key: LocalStorageKey, value: any): Promise<void> {
    const valueToSave: string = safelyStringifyValueForLocalStorage(value);
    return AsyncStorage.setItem(key as any, valueToSave).catch((error: IGenericError | any) => {
      return this.handleAsyncStorageError(error);
    });
  }
  // --------------------

  /**
   * @param key String
   * @returns Promise<void>
   */
  public async removeItem(key: LocalStorageKey): Promise<void> {
    return AsyncStorage.removeItem(key as any).catch((error: IGenericError | any) => {
      return this.handleAsyncStorageError(error);
    });
  }
  // --------------------

  /**
   * @param key String
   * @param value: Stringified Object
   * @returns Promise<void>
   */
  public async mergeItem(key: LocalStorageKey, value: string): Promise<void> {
    const valueToSave: string = safelyStringifyValueForLocalStorage(value);
    return AsyncStorage.mergeItem(key as any, valueToSave).catch((error: IGenericError | any) => {
      return this.handleAsyncStorageError(error);
    });
  }
  // --------------------

  /**
   * @returns Promise<void>
   */
  public async clearAll(): Promise<void> {
    return AsyncStorage.clear().catch((error: IGenericError | any) => {
      return this.handleAsyncStorageError(error);
    });
  }
  // --------------------

  /**
   * @returns Promise<any[]>
   */
  public async getAllKeys(): Promise<any[]> {
    return AsyncStorage.getAllKeys().catch((error: IGenericError | any) => {
      return this.handleAsyncStorageError(error);
    });
  }
  // --------------------

  /**
   * @param keys String[]
   * @param returnParsed Boolean
   * @returns Promise<void | any[]>
   */
  public async multiGet(keys: LocalStorageKey[], returnedParsed?: boolean): Promise<void | any[]> {
    return AsyncStorage.multiGet(keys as any[]).then((result: Array<[string, string | null]>) => {
      _.each(result, (keyValPair: [string, string | null]) => {
        if (keyValPair.length > 1) {
          keyValPair[1] = returnedParsed ? safelyParseValueFromLocalStorage(keyValPair[1]) : keyValPair[1];
        } else {
          keyValPair.push('');
        }
      });
      return result;
    }).catch((error: IGenericError | any) => {
      return this.handleAsyncStorageError(error);
    });
  }
  // --------------------

  /**
   * @param keyValPairs KeyValPair[LocalStorageKey, string][]
   * @returns Promise<any[]>
   */
  public async multiSet(keyValPairs: KeyValPair[]): Promise<any> {
    _.each(keyValPairs, (keyValPair: KeyValPair) => {
      if (keyValPair.length > 1) {
        keyValPair[1] = safelyStringifyValueForLocalStorage(keyValPair[1]);
      } else {
        keyValPair.push('');
      }
    });
    return AsyncStorage.multiSet(keyValPairs as any[][]).catch((error: IGenericError | any) => {
      return this.handleAsyncStorageError(error);
    });
  }
  // --------------------

  /**
   * @param keys String[]
   * @returns Promise<void[]>
   */
  public async multiRemove(keys: LocalStorageKey[]): Promise<void> {
    return AsyncStorage.multiRemove(keys as any[]).catch((error: IGenericError | any) => {
      return this.handleAsyncStorageError(error);
    });
  }
  // --------------------

  /**
   * @param keyValPairs KeyValPair[LocalStorageKey, string][]
   * @returns Promise<void[]>
   */
  public async multiMerge(keyValPairs: KeyValPair[]): Promise<void> {
    _.each(keyValPairs, (keyValPair: KeyValPair) => {
      if (keyValPair.length > 1) {
        keyValPair[1] = safelyStringifyValueForLocalStorage(keyValPair[1]);
      } else {
        keyValPair.push('');
      }
    });
    return AsyncStorage.multiMerge(keyValPairs as any[][]).catch((error: IGenericError | any) => {
      return this.handleAsyncStorageError(error);
    });
  }
  // -----------------------------------------------------------------------

  // Error Handling --------------------------------------------------------
  private async handleAsyncStorageError(errorObject: IGenericError | any): Promise<any> {
    const handledError: IHandledError = {} as IHandledError;
    handledError.source = ErrorSource.NATIVE_MODULE;
    handledError.errorObject = errorObject;
    return Promise.reject(handledError);
  }
  // -----------------------------------------------------------------------
}

export const LocalStorageService = LocalStorage._getInstance();
