import {RemoteRequester, SuccessfulApiResponse} from "../../index";
import AuthorizationManager from "../authorization/AuthorizationManager";
import ApiClient from "../ApiClient";
import Endpoint from "../endpoints/Endpoint";
import ApiResponseErrorHandler from "../errors/ApiResponseErrorHandler";
import AuthenticationErrorResponse from "../responses/generalResponses/AuthenticationErrorResponse";

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
    exampleEndpoint() {
        const endpoint = new ExampleEndpoint();
        return this._callEndpoint(endpoint, {});
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
        console.log('handling!')
    }
}


function mainExample() {
    /*
    * This is an example of how to use the library.
    * Requester is created and authorization for it is provided along with the base url.
    * If you want to you can set a general error handler for the client. Every call will call this handler if the response has an error.
    * You can also set a custom error handler for a specific call. This will be considered before of the ones in general error handler.
     */
    const requester = new RemoteRequester("http.example.com/api", new AppAuthorizationManager());
    const generalErrorHandler = new GeneralErrorHandlerBuilder().build();
    const client = new ExampleApiClient(requester, generalErrorHandler);
    const customErrorHandler = new ApiResponseErrorHandler().handlesError(
        AuthenticationErrorResponse,
        (request) => {
            console.log('handling but custom!');
        },
    );
    client.exampleEndpoint().then(response => {
        console.log(response);
    });
}