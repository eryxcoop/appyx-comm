import {ApiError} from "./ApiError";

export default class ApiResponseErrorHandler {
    constructor(errorMapper) {
        this._errorMapper = errorMapper;
    }

    handlesError(error, handler) {
        const newErrorHandler = new ApiResponseErrorHandler({
            [error]: handler,
        });
        return this.mergeWith(newErrorHandler);
    }

    errorMapper() {
        return this._errorMapper;
    }

    mergeWith(anotherErrorHandler = undefined) {
        if (!anotherErrorHandler) {
            return this;
        }
        const anotherErrorMapper = anotherErrorHandler.errorMapper();
        const newErrorMapper = {
            ...this._errorMapper,
            ...anotherErrorMapper,
        };
        return new ApiResponseErrorHandler(newErrorMapper);
    }

    async handleErrorForRequest(response, request) {
        const handler = this._errorMapper[response.constructor];
        if (handler) {
            return await handler(request);
        }
        throw new ApiError(response);
    }
}
