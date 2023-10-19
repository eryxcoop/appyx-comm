export default class HTTPResponse {
    constructor(response) {
        this._response = response;
    }

    httpStatusCode() {
        return this._response.status;
    }
}
