export class ApiError extends Error {
    constructor(response) {
        super(response.message());
    }
}