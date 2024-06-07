import Endpoint from "../src/endpoints/Endpoint";
import {FakeRequester, SuccessfulApiResponse} from "../index";
import ApiClient from "../src/ApiClient";
import ApiResponseHandler from "../src/errors/ApiResponseHandler.js";
import AuthenticationErrorResponse from "../src/responses/generalResponses/AuthenticationErrorResponse";

import {expect, test} from 'vitest'
import {DummyRequester} from "./utils/DummyRequester.js";

class TestSuccessfulApiResponse extends SuccessfulApiResponse {

  static defaultResponse() {
    return 'default response'
  }

  understandThis(jsonResponse) {
    return jsonResponse.status === 'ok';
  }

  response() {
    return this._jsonResponse;
  }
}

class AnotherTestSuccessfulApiResponse extends SuccessfulApiResponse {

  static defaultResponse() {
    return 'not the default response'
  }

  understandThis(jsonResponse) {
    return jsonResponse.status === 'ok';
  }

  response() {
    return this._jsonResponse;
  }
}

class ExampleApiClient extends ApiClient {
  exampleEndpoint(customResponseHandler) {
    const endpoint = Endpoint.newGet({
      url: 'example',
      ownResponses: [SuccessfulApiResponse],
      needsAuthorization: false,
    });
    return this.callEndpoint(endpoint, {}, customResponseHandler);
  }
}

function dummyRequesterExpectingSuccessfulResponse() {
  const requester = new DummyRequester();
  requester.setExpectedResponses(
    new SuccessfulApiResponse(
      {
        "object": {'message': "Hi!"},
        "errors": []
      }
    ));
  return requester;
}

function dummyRequesterExpectingAuthenticationErrorResponse() {
  const requester = new DummyRequester();
  requester.setExpectedResponses(
    new AuthenticationErrorResponse(
      {
        "object": null,
        "errors": ['errors']
      }
    ));
  return requester;
}

function endpointWithResponses(responses) {
  return Endpoint.newGet({
    url: 'example',
    ownResponses: responses,
    needsAuthorization: false,
  });
}

test('Test general error handling can be set for api client', async () => {
  // Given a client that is not authenticated
  const requester = dummyRequesterExpectingAuthenticationErrorResponse();

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
  const requester = dummyRequesterExpectingAuthenticationErrorResponse();

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
  const requester = dummyRequesterExpectingSuccessfulResponse();

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


test('Test you can clarify to response handler the way to handle any success case', async () => {
  // Given a client
  const requester = dummyRequesterExpectingSuccessfulResponse();

  const client = new ExampleApiClient(requester);

  const customResponseHandler = new ApiResponseHandler({}).handlesSuccess(
    (response, request) => {
      return 'alles gut!'
    },
  )

  const response = await client.exampleEndpoint(customResponseHandler);

  // Then the response is handled by the custom response handler
  expect(response).toBe('alles gut!')
});


test('Test you can customize your success response', async () => {
  // Given a client
  const requester = new DummyRequester();
  requester.setExpectedResponses(
    new TestSuccessfulApiResponse(
      {
        errors: [],
        object: 'ok',
      }
    ));

  const client = new ExampleApiClient(requester);

  //  but has a handler for successful responses
  const customResponseHandler = new ApiResponseHandler({}).handlesSuccess(
    (response, request) => {
      return 'alles gut!'
    },
  )
  const response = await client.exampleEndpoint(customResponseHandler);

  // Then the response is handled by the custom response handler
  expect(response).toBe('alles gut!')
});

test('Test you can clarify to response handler the way to handle any error raised', async () => {
  // Given a client
  const requester = dummyRequesterExpectingAuthenticationErrorResponse();

  const client = new ExampleApiClient(requester);

  //  but has a handler for successful responses
  let customResponseHandler = new ApiResponseHandler({}).handlesError((request) => {
    return 'alles nicht gut!'
  });

  const response = await client.exampleEndpoint(customResponseHandler);

  // Then the response is handled by the custom response handler
  expect(response).toBe('alles nicht gut!')
});


test('Test you cant merge two response handlers that clarify handles error', async () => {
  // Given a client
  const requester = dummyRequesterExpectingAuthenticationErrorResponse();

  const client = new ExampleApiClient(requester);

  // Given two response handlers
  let oneResponseHandler = new ApiResponseHandler({}).handlesError((request) => {
    return 'alles nicht gut!'
  });
  let anotherResponseHandler = new ApiResponseHandler({}).handlesError((request) => {
    return 'alles nicht nicht gut!'
  });

  // When i merge them
  const responseHandler = oneResponseHandler.mergeWith(anotherResponseHandler);

  // Then last response handler error is used
  const response = await client.exampleEndpoint(responseHandler);

  // Then the response is handled by the custom response handler
  expect(response).toBe('alles nicht nicht gut!')

});

test('Test multiple responses can be set but only received is handled', async () => {
  // Given a client
  const requester = dummyRequesterExpectingSuccessfulResponse();

  const client = new ExampleApiClient(requester);

  //  but has a handler for successful responses
  let customResponseHandler = new ApiResponseHandler({}
  ).handles(
    SuccessfulApiResponse,
    (request) => {
      return 'alles gut!'
    },
  ).handles(
    AuthenticationErrorResponse,
    (request) => {
      return 'alles nicht gut!'
    },
  );
  const response = await client.exampleEndpoint(customResponseHandler);

  // Then the response is handled by the custom response handler
  expect(response).toBe('alles gut!')
});


test('Generic success cases can be handled', async () => {
  // Given a client
  const requester = dummyRequesterExpectingSuccessfulResponse();

  const client = new ExampleApiClient(requester);

  //  but has a handler for successful responses
  const customResponseHandler = new ApiResponseHandler(
    {
      handlesSuccess: (response, request) => {
        return 'alles gut!';
      }
    }
  );
  const response = await client.exampleEndpoint(customResponseHandler);

  // Then the response is handled by the custom response handler
  expect(response).toBe('alles gut!')
});

test('Generic error cases can be handled', async () => {
  // Given a client
  const requester = dummyRequesterExpectingAuthenticationErrorResponse();

  const client = new ExampleApiClient(requester);

  //  but has a handler for error responses
  const customResponseHandler = new ApiResponseHandler(
    {
      handlesError: (response, request) => {
        return 'alles nicht gut!';
      }
    }
  );
  const response = await client.exampleEndpoint(customResponseHandler);

  // Then the response is handled by the custom response handler
  expect(response).toBe('alles nicht gut!')
});


test('Endpoint can be created with composition not heritage', async () => {
  // Given a client
  const requester = dummyRequesterExpectingSuccessfulResponse();
  const apiClient = new ApiClient(requester);
  const customResponseHandler = new ApiResponseHandler(
    {
      handlesSuccess: (response, request) => {
        return 'alles gut!';
      }
    }
  );

  // I can create a get endpoint
  const getEndpoint = Endpoint.newGet({
    url: 'example',
    ownResponses: [SuccessfulApiResponse],
  });

  const response = await apiClient.callEndpoint(getEndpoint, {}, customResponseHandler);


  // Then the response is handled by the custom response handler
  expect(response).toBe('alles gut!')
});

// Fake requester

test('When fake requester is used default response is returned', async () => {
  // Given a client
  const requester = new FakeRequester({waitingTime: 0});
  const apiClient = new ApiClient(requester);

  // I can create a get endpoint
  const getEndpoint = endpointWithResponses([TestSuccessfulApiResponse]);

  const customResponseHandler = new ApiResponseHandler(
    {
      handlesSuccess: (response, request) => {
        return response.response();
      }
    }
  );

  const response = await apiClient.callEndpoint(getEndpoint, {}, customResponseHandler);

  // Then the response is handled by the custom response handler
  expect(response).toBe(TestSuccessfulApiResponse.defaultResponse());
});

test('When using fake requester default response can be overwritten', async () => {
  // Given a client
  const requester = new FakeRequester({waitingTime: 0});
  const apiClient = new ApiClient(requester);

  // I can create a get endpoint
  const getEndpoint = endpointWithResponses([TestSuccessfulApiResponse]);

  requester.addResponseFor({endpoint: getEndpoint, response: AnotherTestSuccessfulApiResponse});

  const customResponseHandler = new ApiResponseHandler(
    {
      handlesSuccess: (response, request) => {
        return response.response();
      }
    }
  );

  const response = await apiClient.callEndpoint(getEndpoint, {}, customResponseHandler);

  // Then the response is handled by the custom response handler
  expect(response).toBe(AnotherTestSuccessfulApiResponse.defaultResponse());
});