import ApiErrorResponse from "./ApiErrorResponse";

export default class UnexpectedErrorResponse extends ApiErrorResponse {
    static errorCodes() {
        return ["unexpected_error_code"];
    }
}