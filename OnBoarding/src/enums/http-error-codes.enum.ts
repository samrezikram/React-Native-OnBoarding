export enum HTTPErrorCode {

  // Standard Http Errors ---
  UNAUTHORIZED = 401, // Should return Only in case of an authorized endpoint with invalid access token (Should be refreshed then), otherwise, it's a bug in the backend
  INTERNAEL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_NOT_AVAILABLE = 503,
  GATEWAY_TIMEOUT = 504
}
