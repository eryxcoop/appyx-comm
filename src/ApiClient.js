import ApiResponseErrorHandler from "./errors/ApiResponseErrorHandler";

export default class ApiClient {
    constructor(
        requester,
        apiResponseErrorHandler = undefined,
        onExceptionDo = (exception) => {
            throw exception;
        },
    ) {
        this._requester = requester;
        this._onExceptionDo = onExceptionDo;
        this._defaultHandleError = () => {
        };
        this._apiResponseErrorHandler = apiResponseErrorHandler || new ApiResponseErrorHandler();
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

    _handleErrorForRequest(response, endpoint, values, errorHandler = undefined) {
        const retry = async () => {
            return this._callEndpoint(endpoint, values);
        };
        const request = {endpoint, values, retry};

        const apiResponseErrorHandler = this._apiResponseErrorHandler.mergeWith(errorHandler);
        return apiResponseErrorHandler.handleErrorForRequest(response, request);
    }


    async _callEndpoint(endpoint, values, errorHandler) {
        try {
            const response = await this._call(endpoint, values);
            if (!response.hasError()) {
                return response;
            }
            return this._handleErrorForRequest(response, endpoint, values, errorHandler);
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
