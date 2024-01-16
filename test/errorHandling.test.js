import Endpoint from "../src/endpoints/Endpoint";
import {SuccessfulApiResponse} from "../index";
import ApiClient from "../src/ApiClient";
import ApiResponseErrorHandler from "../src/errors/ApiResponseErrorHandler";
import AuthenticationErrorResponse from "../src/responses/generalResponses/AuthenticationErrorResponse";

import {expect, test} from 'vitest'
import {DummyRequester} from "./utils/DummyRequester.js";

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

test('Test general error handling can be set for api client', async () => {
    // Given a client that is not authenticated
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

    // And a call to an endpoint that needs authentication
    const generalErrorHandler = new ApiResponseErrorHandler().handlesError(
        AuthenticationErrorResponse,
        (request) => {
            return 'general error handler'
        },
    );
    const client = new ExampleApiClient(requester, generalErrorHandler);
    const response = await client.exampleEndpoint();

    // Then the response is handled by the general error handler
    expect(response).toBe('general error handler')
});

test('Test general error can be overridden for call in api client', async () => {
    // Given a client that is not authenticated
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

    // And a call to an endpoint that needs authentication
    const generalErrorHandler = new ApiResponseErrorHandler().handlesError(
        AuthenticationErrorResponse,
        (request) => {
            return 'general error handler'
        },
    );
    const client = new ExampleApiClient(requester, generalErrorHandler);

    //  but has a custom error handler for it
    const customErrorHandler = new ApiResponseErrorHandler().handlesError(
        AuthenticationErrorResponse,
        (request) => {
            return 'custom error handler'
        },
    );
    const response = await client.exampleEndpoint(customErrorHandler);

    // Then the response is handled by the custom error handler
    expect(response).toBe('custom error handler')
});