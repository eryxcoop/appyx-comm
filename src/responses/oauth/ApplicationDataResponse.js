import SuccessfulApiResponse from "../generalResponses/SuccessfulApiResponse";


export class ApplicationDataResponse extends SuccessfulApiResponse {
    static defaultResponse() {
        return {
            object: {
                redirect_to: 'example.com',
            },
        }
    }

    clientId() {
        return this.content().client_id;
    }

    redirectUris() {
        return this.content().redirect_uris;
    }

    name() {
        return this.content().name;
    }

    logo() {
        return this.content().logo;
    }

    site() {
        return this.content().site;
    }
}