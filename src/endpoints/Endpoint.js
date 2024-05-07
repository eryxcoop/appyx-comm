import AuthenticationErrorResponse from "../responses/generalResponses/AuthenticationErrorResponse";
import PermissionErrorResponse from "../responses/generalResponses/PermissionErrorResponse";
import {ParametersValidationErrorResponse} from "../responses/generalResponses/ParametersValidationErrorResponse";
import {ParameterValidationErrorResponse} from "../responses/generalResponses/ParameterValidationErrorResponse";
import {SimpleErrorResponse} from "../responses/generalResponses/SimpleErrorResponse";
import UnexpectedErrorResponse from "../responses/generalResponses/UnexpectedErrorResponse";
import SuccessfulApiResponse from "../responses/generalResponses/SuccessfulApiResponse.js";


export default class Endpoint {

  constructor({url, method, ownResponses = undefined, needsAuthorization = true}) {
    this._url = url;
    this._method = method;
    this._ownResponses = ownResponses || [];
    this._needsAuthorization = needsAuthorization;
  }

  static newGet({url, ownResponses, needsAuthorization}) {
    return Endpoint.newFor({url, ownResponses, needsAuthorization, method: Endpoint.getMethod()});
  }

  static newPost({url, ownResponses, needsAuthorization}) {
    return Endpoint.newFor({url, ownResponses, needsAuthorization, method: Endpoint.postMethod()});
  }

  static newPut({url, ownResponses, needsAuthorization}) {
    return Endpoint.newFor({url, ownResponses, needsAuthorization, method: Endpoint.putMethod()});
  }

  static newDelete({url, ownResponses, needsAuthorization}) {
    return Endpoint.newFor({url, ownResponses, needsAuthorization, method: Endpoint.deleteMethod()});
  }

  static newFor({url, ownResponses, needsAuthorization, method}) {
    return new Endpoint({
      url: url,
      method: method,
      ownResponses: ownResponses,
      needsAuthorization: needsAuthorization
    });
  }

  static getMethod() {
    return 'GET'
  }

  static postMethod() {
    return 'POST'
  }

  static putMethod() {
    return 'PUT'
  }

  static deleteMethod() {
    return 'DELETE'
  }

  generalResponses() {
    return [
      SuccessfulApiResponse,
      AuthenticationErrorResponse,
      PermissionErrorResponse,
      SimpleErrorResponse,
      ParametersValidationErrorResponse,
      ParameterValidationErrorResponse,
      UnexpectedErrorResponse,
    ]
  }

  ownResponses() {
    /*
      Provide custom responses
    */
    return this._ownResponses
  }

  responses() {
    /*
        Own responses have more precedence over the general responses
    "*/
    return this.ownResponses().concat(this.generalResponses())
  }

  url() {
    return this._url;
  }

  contentType() {
    return 'application/json';
  }

  method() {
    return this._method;
  }

  needsAuthorization() {
    return this._needsAuthorization;
  }

  isGetMethod() {
    return this.method() === this.constructor.getMethod()
  }

  adaptValues(values) {
    return values
  }
}
