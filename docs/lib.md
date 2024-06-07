# User Guide

## Requesters

### RemoteRequester

``RemoteRequester`` is class that represents a requester. It is used to make requests to the api. You can create your
own requester by extending this class.

```js
const authorizationManager = new AppAuthorizationManager(this);
const remoteRequester = new RemoteRequester(remoteApiUrl, authorizationManager);
```

### FakeRequester

``FakeRequester`` can be used if you are testing your application without having a server running on the other side.
Fake will respond the ``defaultResponse`` you indicate in your expected response of the endpoint you are calling.
``FakeRequester`` will also mock the waiting time of the request. If you don't indicate a waiting time, it will wait 2500 ms.


```js
const fakeRequester = new FakeRequester({waitingTime: 2500});
```

If you don't want to use the default response message, you can override it by passing the response you want to return.

```js
const fakeRequester = new FakeRequester();
fakeRequester.addResponseFor(new ExampleEndpoint(), ExampleSuccessfulResponse);
```

## Endpoints

When you create and ``Endpoint`` you are defining where the request should be made, what type of request is it and what
kind of responses should you expect.
Your ApiClient will be able to execute the endpoint you created.
For example, you can create an endpoint like this:

```js
class ExampleEndpoint extends Endpoint {
  url() {
    return "example_url";
  }

  ownResponses() {
    return [GetExampleResponse];
  }

  method() {
    return this.constructor.getMethod();
  }

  needsAuthorization() {
    return true;
  }
}


// Now you can use it like this
const endpointToExample = new ExampleEndpoint();
const response = await client.callEndpoint(endpointToExample);
```

Now from v1.0.6 you can use the ``Endpoint`` class to create your own endpoints. This way you can avoid creating
multiple
endpoints files and stop using heritage.

```js
const getAuthenticatedEndpoint = Endpoint.newGet(
  {
    url: "my/examplet/endpoint/path",
    ownResponses: [GetExampleResponse]
  }
);
```

By default endpoint will require authorization, but you can specify otherwise.

```js
const getNotAuthenticatedEndpoint = Endpoint.newGet(
  {
    url: "my/examplet/endpoint/path",
    ownResponses: [GetExampleResponse],
    needsAuthorization: false
  }
);
```

Supported methods are: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`.

## Responses

Every time you make a call to the api, you will (usually) receive a response. Response is here for you to represent that
response.
That way you can easily tell your endpoint what kind of responses it should expect.
You can use already created responses in the library such as  ``SuccessfulApiResponse`` or you can create your own to
make use of its full potential and ask your response for specific information

Here is an example of a response:}

```js
// We extend from successful api response because we are representing the successful response of our call.
class ExampleSuccessfulResponse extends SuccessfulApiResponse {
  static defaultResponse() {
    return {
      object: {
        example: {
          value: 1,
        },
      },
      errors: [],
    };
  }

  get exampleValue() {
    return this.content().example.value;
  }
}
```

## Response Handler

### Basic use

Response handlers are used to handle responses received from api requests. Every time you make a call you can indicate
the way
every expected response should be handled. For example, you can indicate that every successful response should be
handled by running a function.
Note that ``ResponseHandler`` is an immutable object, so every time you indicate the way responses should be handled,
you are actually overriding the default response handler.

```js
const customResponseHandler = ApiResponseHandler.for(
  SuccessfulApiResponse,
  (response, request) => {
    doSomething();
  },
);

// doSomething() will be called if exampleEndpoint returns a SuccessfulApiResponse
await client.exampleEndpoint(customResponseHandler);
```

Sometimes you want to handle an specific response always in the same way. For example, you may want to handle every 401
response by authenticating the user again. To do this
you have to indicate all your general responses handlers in the client constructor. For example:

```js
const generalResponsesHandler = ApiResponseHandler.for(
  AuthenticationErrorResponse,
  (response, request) => {
    return authenticateUserAgain();
  },
);
const client = new ExampleApiClient(requester, generalResponsesHandler);
```

### Multiple response handler

In order to have multiple responses to consider, you can clarify them all with the ``handler`` method. Remember
that ``ApiResponseHandler`` is an unmutable object, so everytime a
response is add it will return a new ``ApiResponseHandler`` object. For example:

```js
let responsesHandler = new ApiResponseHandler();
responsesHandler = responseHandler.handles(
  SuccessfulApiResponse,
  (response, request) => {
    return doSomething();
  },
);
responsesHandler = responseHandler.handles(
  AuthenticationErrorResponse,
  (response, request) => {
    return authenticateUserAgain();
  },
);
const client = new ExampleApiClient(requester, responsesHandler);
```

Now you may be wondering, what happens if I want to handle a specific response in a different way? Well, you can already
do that! every time you indicate
the way responses should be handled, you are actually overriding the default response handler. So, if you want to handle
a specific response in a different way,
just override the default response handler again.

### Successful and error responses

Sometimes you may want to have only two different cases to handle, successful responses and error responses. You can do
that by:

```js
let responsesHandler = new ApiResponseHandler();
responsesHandler = responseHandler
  .handlesSuccess((response, request) => {
      return doSomething();
    },
  ).handlesError((response, request) => {
      return authenticateUserAgain();
    },
  );
const client = new ExampleApiClient(requester, responsesHandler);
```

## ApiClient

Finally, you can create your own ApiClient using ``ApiClient`` class. This class is the one that will be used
to make the requests to the api.

We add a small example of a complete case of use:

```js
class MyApiClient {

  // We recommend to create you own api client to sum up all the calls you will make to the api

  constructor(requester) {
    this._apiClient = new ApiClient(requester);
  }

  registerNewUser(email, responseHandler) {
    const endpoint = new RegisterUserEndpoint();
    return this._apiClient.callEndpoint(endpoint, {email}, responseHandler);
  }
}

// We create remote requester
const authorizationManager = new AppAuthorizationManager(this);
const remoteRequester = new RemoteRequester(remoteApiUrl, authorizationManager);

// We create the client
const endpointToExample = new MyApiClient(remoteRequester);

// We create responses handler for registering a new user
const responseHandler = new ApiResponseHandler({
  handlesError: (error) => {
    console.log(error);
  },
  handlesSuccess: (response) => {
    console.log("success!!")
  }
});

// We register a new user
client.registerNewUser("delfi@brea.com", responseHandler);
```