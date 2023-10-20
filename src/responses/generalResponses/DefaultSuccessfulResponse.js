import SuccessfulApiResponse from "./SuccessfulApiResponse";

export default class DefaultSuccessfulResponse extends SuccessfulApiResponse {
    static defaultResponse() {
        return {
            "object": {},
            "errors": []
        }
    }
}