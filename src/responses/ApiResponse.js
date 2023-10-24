export default class ApiResponse {
    static understandThis(jsonResponse) {
        throw new Error("You have to implement the method");
    }

    static defaultResponse() {
        throw new Error("You have to implement the method");
    }

    constructor(jsonResponse) {
        this._jsonResponse = jsonResponse;
    }

    static asDefaultResponse() {
        const jsonResponse = this.defaultResponse();
        return new this(jsonResponse);
    }

    hasError() {
        return this.errors().length >= 1
    }

    errors() {
        return this._jsonResponse.errors || [];
    }

    content() {
        return this._jsonResponse.object || {};
    }

    alerts() {
        return this._jsonResponse.alerts || [];
    }
}