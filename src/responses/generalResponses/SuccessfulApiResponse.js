import ApiResponse from "../response"

export default class SuccessfulApiResponse extends ApiResponse {

    static understandThis(jsonResponse) {
        return jsonResponse.errors && jsonResponse.errors.length === 0;
    }
}