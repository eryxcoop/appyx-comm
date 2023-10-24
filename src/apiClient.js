import ServerErrorResponse from "./responses/generalResponses/ServerErrorResponse";
import UnexpectedErrorResponse from "./responses/generalResponses/UnexpectedErrorResponse";
import AuthenticationErrorResponse from "./responses/generalResponses/AuthenticationErrorResponse";

export default class ApiClient {
    constructor(
        requester,
        onServerErrorDo = () => {
        },
        onAuthorizationErrorDo = () => {
        },
        onExceptionDo = (exception) => {
            throw exception;
        },
    ) {
        this._requester = requester;
        this._onServerErrorDo = onServerErrorDo;
        this._onExceptionDo = onExceptionDo;
        this._defaultHandleError = () => {};
        this._onAuthorizationErrorDo = onAuthorizationErrorDo;
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

            return response
        }

        if (response instanceof ServerErrorResponse || response instanceof UnexpectedErrorResponse) {
            return this._onServerErrorDo(response);
        }

        if (response instanceof AuthenticationErrorResponse) {
            return this._onAuthorizationErrorDo(response);
        }
        return response;
    }


    _callEndpoint(endpoint, values, errorHandler) {
        let result = this._call(endpoint, values);
        return result.then((response) => {
            this._handleResponse(response, errorHandler)
            if (response.hasError()) {
                return Promise.reject(response.message());
            }
            return result
        }).catch((exception) => {
            return this._handleException(exception);
        });
    }

    _call(endpoint, values) {
        return this._requester.call({
            endpoint: endpoint,
            data: endpoint.adaptValues(values)
        });
    }

}
