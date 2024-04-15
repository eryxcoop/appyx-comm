# Examples

We add some common uses of the appyx-comm package that may come in handy.

## Authentication

Imagine having an access token and a refresh token. Given a specific time, the access token will expire and we will need to refresh it using the refresh token.
You may not want to be checking the expiration time of the access token every time you make a request. You can a generic response handler, that will try to authenticate
the user if the response status is 401.

```js
const generalErrorHandler = ApiResponseHandler.for(
    AuthenticationErrorResponse,
    async () => {
        // We are not authenticated, let's try to refresh the access token
        const refreshToken = this._refreshToken();
        try {
            const refreshResponse = await this._refreshAccessToken(refreshToken);
            await this._updateSession(refreshResponse.accessToken(), refreshResponse.refreshToken());
        } catch (_) {
            // We couldn't refresh the access token, let's log out
            return await this._application.logOut();
        }
        // We refreshed the access token, let's retry the request
        return await request.retry();
    },
);
```

Now we can create our ApiClient using this generalErrorHandler. Every time we receive a 401 response, the generalErrorHandler will try to refresh the access token.
In case of failure, it will log out the user.

```js
const apiClient = new ApiClient(generalErrorHandler);
```