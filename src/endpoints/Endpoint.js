import AuthenticationErrorResponse from "../responses/generalResponses/AuthenticationErrorResponse";
import PermissionErrorResponse from "../responses/generalResponses/PermissionErrorResponse";
import {ParametersValidationErrorResponse} from "../responses/generalResponses/ParametersValidationErrorResponse";
import {ParameterValidationErrorResponse} from "../responses/generalResponses/ParameterValidationErrorResponse";
import {SimpleErrorResponse} from "../responses/generalResponses/SimpleErrorResponse";
import UnexpectedErrorResponse from "../responses/generalResponses/UnexpectedErrorResponse";
import SuccessfulApiResponse from "../responses/generalResponses/SuccessfulApiResponse.js";


export default class Endpoint {
  static CONTENT_TYPE_JSON = 'application/json';
  static CONTENT_TYPE_MULTIPART = 'multipart/form-data';
  static CONTENT_TYPE_TEXT = 'text/plain';

  constructor({
                url,
                method,
                ownResponses = undefined,
                needsAuthorization = true,
                contentType = undefined,
                responseContentType = undefined
              }) {
    this._url = url;
    this._method = method;
    this._ownResponses = ownResponses || [];
    this._needsAuthorization = needsAuthorization;
    this._contentType = contentType || Endpoint.CONTENT_TYPE_JSON;
    this._responseContentType = responseContentType || Endpoint.CONTENT_TYPE_JSON;
  }

  static newGet({url, ownResponses, needsAuthorization, contentType, responseContentType}) {
    return this.newFor({
      url,
      ownResponses,
      needsAuthorization,
      contentType,
      responseContentType,
      method: Endpoint.getMethod()
    });
  }

  static newPost({url, ownResponses, needsAuthorization, contentType, responseContentType}) {
    return this.newFor({
      url,
      ownResponses,
      needsAuthorization,
      contentType,
      responseContentType,
      method: Endpoint.postMethod()
    });
  }

  static newPut({url, ownResponses, needsAuthorization, contentType, responseContentType}) {
    return this.newFor({
      url,
      ownResponses,
      needsAuthorization,
      contentType,
      responseContentType,
      method: Endpoint.putMethod()
    });
  }

  static newDelete({url, ownResponses, needsAuthorization, contentType, responseContentType}) {
    return this.newFor({
      url,
      ownResponses,
      needsAuthorization,
      contentType,
      responseContentType,
      method: Endpoint.deleteMethod()
    });
  }

  static newPatch({url, ownResponses, needsAuthorization, contentType, responseContentType}) {
    return this.newFor({
      url,
      ownResponses,
      needsAuthorization,
      contentType,
      responseContentType,
      method: Endpoint.patchMethod()
    });
  }

  static newFor({url, ownResponses, needsAuthorization, method, contentType, responseContentType}) {
    return new Endpoint({
      url: url,
      method: method,
      ownResponses: ownResponses,
      contentType: contentType,
      responseContentType: responseContentType,
      needsAuthorization: needsAuthorization
    });
  }

  convertBodyResponse(response) {
    // Response will be responsible for this in the future
    if (this._responseContentType === Endpoint.CONTENT_TYPE_JSON) {
      return response.json();
    } else if (this._responseContentType === Endpoint.CONTENT_TYPE_TEXT) {
      return response.text();
    }
    throw new Error("Content type not supported");
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

  static patchMethod() {
    return 'PATCH'
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
    return this._contentType;
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
