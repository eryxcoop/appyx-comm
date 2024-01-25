import {ApiError} from "./ApiError";

export default class ApiResponseHandler {
    constructor(responseMapper) {
        this._responseMapper = responseMapper;
    }
    handles(response, handler) {
        const newResponseHandler = new ApiResponseHandler({
            [response]: handler,
        });
        return this.mergeWith(newResponseHandler);
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
        return new ApiResponseHandler(newResponseMapper);
    }

    async handleResponseForRequest(response, request) {
        const handler = this._responseMapper[response.constructor];
        if (handler) {
            return await handler(request);
        }
        throw new ApiError(response);
    }
}
