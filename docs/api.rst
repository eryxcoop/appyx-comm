
``Requesters``
-------------

Information about the requesters.

``Endpoints``
-------------

Information about endpoints.


``Responses``
-------------

Every time you make a call to the api, you will (usually) received a json response. Response is here for you to represent that response. That way you can easily tell
you endpoint what kind of responses it should expect. You can use responses such as  ``SuccessfulApiResponse`` already given by the library or you can create your own to
make use of its full potential and ask your response for specific information




``Response Handler``
-------------

Response handlers are used to handle responses received from api requests. Every time you make a call you can indicate the way
every expected response should be handled. For example, you can indicate that every successful response should be handled by running a function.


.. code-block:: javascript
  :linenos:

    const customResponseHandler = ApiResponseHandler.for(
        SuccessfulApiResponse,
        (request) => {
            doSomething();
        },
    );

    // doSomething() will be called if exampleEndpoint returns a SuccessfulApiResponse
    await client.exampleEndpoint(customResponseHandler);


Sometimes you want to handle an specific response always in the same way. For example, you may want to handle every 401 response by authenticating the user again. To do this
you have to indicate all your general responses handlers in the client constructor. For example:

.. code-block:: javascript
  :linenos:

    const generalResponsesHandler = ApiResponseHandler.for(
        AuthenticationErrorResponse,
        (request) => {
            return authenticateUserAgain();
        },
    );
    const client = new ExampleApiClient(requester, generalResponsesHandler);


In order to have multiple  responses to consider, you can clarify them all with the ``handler`` method. Remember that ``ApiResponseHandler`` is an unmutable object, so everytime a
response is add it will return a new ``ApiResponseHandler`` object. For example:

.. code-block:: javascript
  :linenos:

    let responsesHandler = new ApiResponseHandler();
    responsesHandler = responseHandler.handles(
        SuccessfulApiResponse,
        (request) => {
            return doSomething();
        },
    );
    responsesHandler = responseHandler.handles(
        AuthenticationErrorResponse,
        (request) => {
            return authenticateUserAgain();
        },
    );
    const client = new ExampleApiClient(requester, responsesHandler);

Now you may be wondering, what happens if I want to handle a specific response in a different way? Well, you can already do that! every time you indicate
the way responses should be handled, you are actually overriding the default response handler. So, if you want to handle a specific response in a different way,
just override the default response handler again.