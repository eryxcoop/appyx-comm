import ApiErrorResponse from "./ApiErrorResponse";

export class ParameterValidationErrorResponse extends ApiErrorResponse {
    static errorCodes() {
        return ["parameter_validation_error_code"];
    }

    parameterName() {
        return this.errors()[0]["parameter_name"]
    }

    fieldErrors() {
        return {
            [this.parameterName()]: super.errorMessages()[0].split("Reasons: ")[1]
        }
    }

    errorMessages() {
        return Object.values(this.fieldErrors())
    }
}