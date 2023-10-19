import SuccessfulApiResponse from "../generalResponses/SuccessfulApiResponse";

export class AuthorizedRedirectResponse extends SuccessfulApiResponse {
    static defaultResponse() {
        return {
            object: {
                redirect_to: 'example.com',
            },
        }
    }

    redirectionTarget() {
        return this.content().redirect_to;
    }
}