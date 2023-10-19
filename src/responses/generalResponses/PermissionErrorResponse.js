import HTTPResponse from "./HTTPResponse";


export default class PermissionErrorResponse extends HTTPResponse {
    static understandThis(response) {
        return response.errors && response.errors[0].code === "permission_denied_for_operator";
    }

    static defaultResponse() {
        return {
            "object": null,
            "errors": [
                {
                    "code": "permission_denied_for_operator",
                    "text": ""
                }
            ]
        }
    }

    static errorCodes() {
        return ["authentication_error"];
    }
}