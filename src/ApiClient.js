import ApiResponseHandler from "./errors/ApiResponseHandler.js";

export default class ApiClient {
  constructor(
    requester,
    apiResponseHandler = undefined,
    onExceptionDo = (exception) => {
      throw exception;
    },
  ) {
    this._requester = requester;
    this._onExceptionDo = onExceptionDo;
    this._defaultHandleError = () => {
    };
    this._apiResponseHandler = apiResponseHandler || new ApiResponseHandler({});
    this._handleResponse = this._handleResponse.bind(this);
    this._handleException = this._handleException.bind(this);
  }

  _handleException(exception) {
    return this._onExceptionDo(exception);
  }

  _handleResponse(response, handleError) {
    if (response.hasError()) {
      if (handleError === undefined) {
        this._defaultHandleError(response);
      } else {
        handleError(response)
      }
    }
  }

  _handleResponseForRequest(response, endpoint, values, responseHandler = undefined) {
    const retry = async () => {
      return this.callEndpoint(endpoint, values);
    };
    const request = {endpoint, values, retry};

    const apiResponseHandler = this._apiResponseHandler.mergeWith(responseHandler);
    return apiResponseHandler.handleResponseForRequest(response, request);
  }

  async callEndpoint(endpoint, values, customResponseHandler) {
    try {
      const response = await this._call(endpoint, values);
      return this._handleResponseForRequest(response, endpoint, values, customResponseHandler);
    } catch (exception) {
      return this._handleException(exception);
    }
  }

  _call(endpoint, values) {
    return this._requester.call({
      endpoint: endpoint,
      data: endpoint.adaptValues(values)
    });
  }

}
