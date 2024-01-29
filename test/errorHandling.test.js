import Endpoint from "../src/endpoints/Endpoint";
import {SuccessfulApiResponse} from "../index";
import ApiClient from "../src/ApiClient";
import ApiResponseHandler from "../src/errors/ApiResponseHandler.js";
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
    exampleEndpoint(customResponseHandler) {
        const endpoint = new ExampleEndpoint();
        return this._callEndpoint(endpoint, {}, customResponseHandler);
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
    const generalErrorHandler = ApiResponseHandler.for(
        AuthenticationErrorResponse,
        () => {
            return 'general error handler'
        },
    );
    const client = new ExampleApiClient(requester, generalErrorHandler);
    const response = await client.exampleEndpoint();

    // Then the response is handled by the general response handler
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
    const generalErrorHandler = ApiResponseHandler.for(
        AuthenticationErrorResponse,
        (request) => {
            return 'general error handler'
        },
    );
    const client = new ExampleApiClient(requester, generalErrorHandler);

    //  but has a custom error handler for it
    const customErrorHandler = ApiResponseHandler.for(
        AuthenticationErrorResponse,
        (request) => {
            return 'custom error handler'
        },
    );
    const response = await client.exampleEndpoint(customErrorHandler);

    // Then the response is handled by the custom response handler
    expect(response).toBe('custom error handler')
});

test('Test success handling', async () => {
    // Given a client
    const requester = new DummyRequester();
    requester.setExpectedResponses(
        new SuccessfulApiResponse(
            {
                "object": {'message': "Hi!"},
                "errors": []
            }
        ));

    const client = new ExampleApiClient(requester);

    //  but has a handler for successful responses
    const customResponseHandler = ApiResponseHandler.for(
        SuccessfulApiResponse,
        (request) => {
            return 'alles gut!'
        },
    );
    const response = await client.exampleEndpoint(customResponseHandler);

    // Then the response is handled by the custom response handler
    expect(response).toBe('alles gut!')
});

test('Test multiple responses can be set but only received is handled', async () => {
    // Given a client
    const requester = new DummyRequester();
    requester.setExpectedResponses(
        new SuccessfulApiResponse(
            {
                "object": {'message': "Hi!"},
                "errors": []
            }
        ));

    const client = new ExampleApiClient(requester);

    //  but has a handler for successful responses
    let customResponseHandler = new ApiResponseHandler();
    customResponseHandler = customResponseHandler.handles(
        SuccessfulApiResponse,
        (request) => {
            return 'alles gut!'
        },
    );
    customResponseHandler = customResponseHandler.handles(
        AuthenticationErrorResponse,
        (request) => {
            return 'alles nicht gut!'
        },
    );
    const response = await client.exampleEndpoint(customResponseHandler);

    // Then the response is handled by the custom response handler
    expect(response).toBe('alles gut!')
});