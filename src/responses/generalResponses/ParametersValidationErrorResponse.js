import ApiErrorResponse from "./ApiErrorResponse";

export class ParametersValidationErrorResponse extends ApiErrorResponse {
    static errorCodes() {
        return ["parameters_validation_error_code"];
    }
}