import {ApiError} from "./ApiError";

export default class ApiResponseHandler {
    constructor({responseMapper = undefined, handlesSuccess = undefined, handlesError = undefined}) {
        this._responseMapper = responseMapper || {};
        this._handlesError = handlesError;
        this._handlesSuccess = handlesSuccess;
    }

    static for(response, handler) {
        const responseMapper = {
            [response]: handler,
        };
        return new this({responseMapper: responseMapper});
    }

    handles(response, handler) {
        const responseMapper = {
            [response]: handler,
        };
        const newResponseHandler = new ApiResponseHandler({responseMapper});
        return this.mergeWith(newResponseHandler);
    }

    handlesSuccess(handler) {
        return new ApiResponseHandler({
            responseMapper: this._responseMapper,
            handlesSuccess: handler,
            handlesError: this._handlesError
        });
    }

    handlesError(handler) {
        return new ApiResponseHandler({
            responseMapper: this._responseMapper,
            handlesSuccess: this._handlesSuccess,
            handlesError: handler
        });
    }

    responseMapper() {
        return this._responseMapper;
    }

    mergeWith(anotherErrorHandler = undefined) {
        if (!anotherErrorHandler) {
            return this;
        }
        const anotherResponseMapper = anotherErrorHandler.responseMapper();
        const newResponseMapper = {
            ...this._responseMapper,
            ...anotherResponseMapper,
        };
        const newHandlesError = anotherErrorHandler._handlesError || this._handlesError;
        const handlesSuccess = anotherErrorHandler._handlesSuccess || this._handlesSuccess;
        return new ApiResponseHandler(
            {
                responseMapper: newResponseMapper,
                handlesSuccess: handlesSuccess,
                handlesError: newHandlesError
            });
    }

    async handleResponseForRequest(response, request) {
        if (!response.hasError() && this._handlesSuccess) {
            return this._handlesSuccess(response, request);
        }

        const handler = this._responseMapper[response.constructor];
        if (handler) {
            return await handler(response, request);
        }
        if (this._handlesError) {
            return this._handlesError(response, request);
        }
        throw new ApiError();
    }
}
