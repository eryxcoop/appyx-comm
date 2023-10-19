import SuccessfulApiResponse from "./SuccessfulApiResponse";

export class DefaultSuccessfulResponse extends SuccessfulApiResponse {
    static defaultResponse() {
        return {
            "object": {},
            "errors": []
        }
    }
}