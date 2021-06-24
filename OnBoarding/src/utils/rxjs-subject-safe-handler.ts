import { Subject, BehaviorSubject, ReplaySubject } from 'rxjs';
import { ISagaThrownError } from '@models/app/errors.model';

import _ from 'lodash';

// Helpers to deal with observables in sagas -------------------------------------------------
// export function emitNext<T>(observer: Subject<T> | BehaviorSubject<T> | ReplaySubject<T> | undefined, nextValue: T): void {
//   if (observer && !_.isNil(observer)) {
//     observer.next(nextValue);
//   }
// }
// --------------------

export function emitNextAndComplete<T>(observer: Subject<T> | BehaviorSubject<T> | ReplaySubject<T> | undefined, nextValue: T): void {
  if (observer && !_.isNil(observer)) {
    observer.next(nextValue);
    observer.complete();
  }
}
// --------------------

// export function complete<T>(observer: Subject<T> | BehaviorSubject<T> | ReplaySubject<T> | undefined): void {
//   if (observer && !_.isNil(observer)) {
//     observer.complete();
//   }
// }
// --------------------

export function throwError<T>(observer: Subject<T> | BehaviorSubject<T> | ReplaySubject<T> | undefined, error: ISagaThrownError): void {
  if (observer && !_.isNil(observer)) {
    observer.error(error);
  }
}
// -------------------------------------------------------------------------------------------

