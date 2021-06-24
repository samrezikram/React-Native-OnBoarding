import { ErrorSource } from '@enums/error-sources.enum';
import { HTTPErrorCode } from '@enums/http-error-codes.enum';

// Base App Error --------------------------------------------------
export interface IFetchIssueGlobalError {
  source: ErrorSource;
  stackTraceCapturer: Error;
  errorDetails: IHttpError | IGenericError | any;
}
// -----------------------------------------------------------------

// Http Exception --------------------------------------------------
export interface IHttpError {
  status?: number;
  url?: string;
  code?: string | number | HTTPErrorCode;
  message: string;
}

export interface IHandledError {
  source: ErrorSource;
  errorObject: IGenericError | IHttpError| any;
}

// -----------------------------------------------------------------

// Generic Exception -----------------------------------------------
export interface IGenericError {
  cod?: string;
  message?: string | number;
  [propName: string]: any;
}
// -----------------------------------------------------------------

// Errors Thrown By Sagas ------------------------------------------
export interface ISagaThrownError {
  title: string;
  message: string;
  errorTranslationMatched: boolean;
  navigationActionHaveBeenTaken: boolean;
  alertActionHaveBeenTaken: boolean;
  fetchGitHubGlobalError: String;
}
// -----------------------------------------------------------------
