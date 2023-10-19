import SuccessfulApiResponse from '../generalResponses/SuccessfulApiResponse';
import { ApplicationDataResponse } from './ApplicationDataResponse';


export class ApplicationDataResponseItem extends ApplicationDataResponse {
    content() {
        return this._jsonResponse;
    }
}

export class ApplicationListResponse extends SuccessfulApiResponse {
    static defaultResponse() {
        return {
            object: [],
        }
    }

    list() {
        return this.content().map(
            item => ({
                'application': new ApplicationDataResponseItem(item.application),
                'scope': item.scope,
            })
        );
    }
}