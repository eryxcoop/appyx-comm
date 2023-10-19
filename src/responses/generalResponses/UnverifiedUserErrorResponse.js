import ApiErrorResponse from "./ApiErrorResponse";

export class UnverifiedUserErrorResponse extends ApiErrorResponse {
    static defaultResponse() {
        return {
            "object": null,
            "errors": [
                {
                    "code": "unverified_user_error_code",
                    "text": "Usuario no verificado"
                }]
        }
    }

    static errorCodes() {
        return ["unverified_user_error_code"];
    }

    message() {
        return 'Para poder operar debes finalizar el proceso de verificación.'
    }

    description() {
        return "Usuario no verificado"
    }
}
