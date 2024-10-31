import ApiErrorResponse from "./ApiErrorResponse";

export default class ConnectivityErrorResponse extends ApiErrorResponse {
  static errorCodes() {
    return ["connectivity_error_code"];
  }
}