import {ApiError} from "./ApiError";
import SuccessfulApiResponse from "../responses/generalResponses/SuccessfulApiResponse.js";

export default class ApiResponseHandler {
    constructor({responseMapper=undefined, successfulResponse=undefined, handlesError=undefined}) {
        this._responseMapper = responseMapper || {};
        this._handlesError = handlesError;
        this._successfulResponse = successfulResponse || this._defaultSuccessfulResponse();
    }

    static for(response, handler) {
        const responseMapper = {
            [response]: handler,
        };
        return new this({responseMapper: responseMapper});
    }

    handles(response, handler) {
        let responseMapper = {}
        responseMapper[response] = handler;
        const newResponseHandler = new ApiResponseHandler({responseMapper});
        return this.mergeWith(newResponseHandler);
    }

    handlesSuccess(handler) {
        return this.handles(this._successfulResponse, handler);
    }

    handlesError(handler) {
        return new ApiResponseHandler({
            responseMapper: this._responseMapper,
            successfulResponse: this._successfulResponse,
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
        const successfulResponse = anotherErrorHandler._successfulResponse || this._successfulResponse;
        return new ApiResponseHandler(
            {
                responseMapper: newResponseMapper,
                successfulResponse: successfulResponse,
                handlesError: newHandlesError
            });
    }

    async handleResponseForRequest(response, request) {

        const handler = this._responseMapper[response.constructor];
        if (handler) {
            return await handler(request);
        }
        if (this._handlesError) {
            return this._handlesError(response);
        }
        throw new ApiError(response);
    }

    _defaultSuccessfulResponse() {
        return SuccessfulApiResponse;
    }
}
