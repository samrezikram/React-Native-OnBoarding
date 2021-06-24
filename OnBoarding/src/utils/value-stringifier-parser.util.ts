import _ from 'lodash';

export function safelyStringifyValueForLocalStorage(value: any): string {
  if (_.isString(value)) {
    return value;
  } else if (_.isBoolean(value)) {
    return value ? 'true' : 'false';
  } else if (_.isNumber(value)) {
    return `${value}`;
  } else if (_.isObjectLike(value)) {
    try {
      return JSON.stringify(value);
    } catch (e) {
      return '{}';
    }
  } else {
    return '';
  }
}
// ------------------------------------

export function safelyParseValueFromLocalStorage(value: any): any {
  if (value) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  } else {
    return undefined;
  }
}
// ---------------------------------------------------------------------------------------