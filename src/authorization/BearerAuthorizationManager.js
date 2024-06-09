import {AuthorizationManager} from "@eryxcoop/appyx-comm";

export default class BearerAuthorizationManager extends AuthorizationManager {

  constructor(getSessionToken) {
    super();
    this._getSessionToken = getSessionToken;
  }

  configureHeaders(headers) {
    const token = this._getSessionToken();
    headers['Authorization'] = `Bearer ${token}`;
  }
}