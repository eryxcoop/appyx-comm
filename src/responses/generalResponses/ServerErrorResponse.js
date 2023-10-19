import HTTPResponse from "./HTTPResponse";

export default class ServerErrorResponse extends HTTPResponse {
    static defaultResponse() {
        return {
            status: 500
        }
    }

    static understandThis(response) {
        return response.status >= 500;
    }

    hasError() {
        return true;
    }

    content() {
        return "Server error code: " + this.httpStatusCode()
    }

    errors() {
        return ["Ocurrió un error. Por favor intentalo de nuevo más tarde"];
    }
}
