import ApiResponse from "../response"

export default class SimpleApiErrorResponse extends ApiResponse {

    static understandThis(jsonResponse) {
        return jsonResponse.contenido && jsonResponse.contenido.errores && jsonResponse.contenido.errores.length > 0;
    }

    errorMessages() {
        return this._jsonResponse.contenido.errores[0].mensaje;
    }

    hasError() {
        return true
    }

    description() {
        return "¡Ha ocurrido un error!"
    }

    message() {
        return this.errorMessages();
    }
}