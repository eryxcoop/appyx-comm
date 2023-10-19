import ApiErrorResponse from "./ApiErrorResponse";

export default class InvalidCredentialsResponse extends ApiErrorResponse {
    static defaultResponse() {
        return {
            "object": null,
            "errors": [
                {
                    "code": "invalid_login_credentials",
                    "text": "Las credenciales no pertenece a un usuario logueado"
                }
            ]
        }
    }

    static errorCodes() {
        return ["invalid_login_credentials"];
    }

    description() {
        return "Hubo un error al validar tus credenciales"
    }

    message() {
        return "Por favor volvete a loguear para poder operar."
    }
}