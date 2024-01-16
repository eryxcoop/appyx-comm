import AuthorizationManager from "../src/authorization/AuthorizationManager";
import Endpoint from "../src/endpoints/Endpoint";
import {SuccessfulApiResponse} from "../index";
import ApiClient from "../src/ApiClient";
import ApiResponseErrorHandler from "../src/errors/ApiResponseErrorHandler";
import AuthenticationErrorResponse from "../src/responses/generalResponses/AuthenticationErrorResponse";

import {assert,expect, test} from 'vitest'
import {Requester} from "../src/requester/Requester.js";

class DummyRequester extends Requester {
    constructor(expectedResponses) {
        super();
        this._expectedResponses = expectedResponses;
    }

    setExpectedResponses(expectedResponses) {
        this._expectedResponses = expectedResponses;
    }

    call({endpoint, data = undefined}) {
        return this._expectedResponses;
    }
}

class AppAuthorizationManager extends AuthorizationManager {
    configureHeaders(headers) {
        headers["Authorization"] = `Bearer 123456}`;
    }
}

class ExampleEndpoint extends Endpoint {
    url() {
        return "example/example";
    }

    method() {
        return "GET";
    }

    needsAuthorization() {
        return false;
    }

    responses() {
        return [SuccessfulApiResponse];
    }

}


class ExampleApiClient extends ApiClient {
    exampleEndpoint(customErrorHandler) {
        const endpoint = new ExampleEndpoint();
        return this._callEndpoint(endpoint, {}, customErrorHandler);
    }
}

class GeneralErrorHandlerBuilder {
    build() {
        return new ApiResponseErrorHandler().handlesError(
            AuthenticationErrorResponse,
            this._handleUnauthenticatedResponse.bind(this),
        );
    }

    async _handleUnauthenticatedResponse(request) {
        console.log('handling request!')
    }
}

test('Basic use', async () => {
    const requester = new DummyRequester();
    requester.setExpectedResponses(
        new AuthenticationErrorResponse(
            {
                "object": null,
                "errors": [
                    {
                        "code": "authentication_error",
                        "text": ""
                    }
                ]
            }
        ));
    const generalErrorHandler = new GeneralErrorHandlerBuilder().build();
    const client = new ExampleApiClient(requester, generalErrorHandler);
    const customErrorHandler = new ApiResponseErrorHandler().handlesError(
        AuthenticationErrorResponse,
        (request) => {
            return 'custom error handler'
        },
    );
    //assert(() => true, 'should be true')
    const response = await client.exampleEndpoint(customErrorHandler);
    expect(response).toBe('custom error handler')
});