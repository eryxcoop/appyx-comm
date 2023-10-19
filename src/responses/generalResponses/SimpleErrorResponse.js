import ApiErrorResponse from "./ApiErrorResponse";

export class SimpleErrorResponse extends ApiErrorResponse {
    static errorCodes() {
        return ["simple_error_code"];
    }
}