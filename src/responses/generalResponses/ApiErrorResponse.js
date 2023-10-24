import ApiResponse from "../ApiResponse"

export default class ApiErrorResponse extends ApiResponse {

    static errorCodes() {
        throw new Error("You have to implement the method");
    }

    static understandThis(jsonResponse) {
        const understandThisForAppyxFormat = jsonResponse.errors && jsonResponse.errors.length > 0 &&
            this.errorCodes().includes(jsonResponse.errors[0].code);
        const understandThisForDeprecatedFormat = jsonResponse.resultado && jsonResponse.resultado === "ERROR";
        return understandThisForAppyxFormat || understandThisForDeprecatedFormat;
    }

    errorMessages() {
        return this.errors().map(eachError => eachError.text)
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