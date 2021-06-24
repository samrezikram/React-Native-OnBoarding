import { IInputValidationResult } from '@models/app/validation-results.model';

import { InputValidity } from '@enums/input-validity.enum';

import { GlobalConfig } from '@config/global.config';

import _ from 'lodash';
import moment from 'moment';

export class Validators {

  private static onlyLettersRegEx: RegExp = /^((?:[^|<>\\\/?.///\"':*\s]+\/?)+)$/;
  private static onlyGithubURLRegEx: RegExp = /(?:git|http|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;

  private constructor() {}

  // Validate organization name -------------------------------------------
  public static validateUsername(username: string): IInputValidationResult {
    const result: IInputValidationResult = {} as IInputValidationResult;
    result.validity = InputValidity.UNDETERMINED;
    result.message = '';
    if (!username || username.length == 0) {
      result.validity = InputValidity.UNDETERMINED;
      result.message = 'Type your github Organization or github Username e.g:- samrezikram';
    } else {
      if ( this.onlyLettersRegEx.test(username)) {
        result.validity = InputValidity.VALID;
        result.message = 'ready to go';
      } else {
        result.validity = InputValidity.INVALID;
        result.message = 'Invalid address';
      }

    }
    return result;
  }
  // ------------------------------------------------------------------
}
