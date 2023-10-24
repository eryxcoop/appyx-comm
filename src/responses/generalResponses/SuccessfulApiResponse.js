import ApiResponse from "../ApiResponse"

export default class SuccessfulApiResponse extends ApiResponse {

    static understandThis(jsonResponse) {
        return jsonResponse.errors && jsonResponse.errors.length === 0;
    }
}