import {ApiResponse} from "../response"

export class AuthorizationErrorResponse extends ApiResponse {
    static defaultResponse() {
        return {
            object: null,
            errors: [
                {code: this.errorCodes()[0]},
            ]
        }
    }

    static errorCodes() {
        return ['oauth2_authorization_error'];
    }

    static understandThis(jsonResponse) {
        return jsonResponse.errors && jsonResponse.errors.length > 0 &&
            this.errorCodes().includes(jsonResponse.errors[0].code);
    }
}
