export class ApiError extends Error {
    constructor() {
        super("Api error not handled");
    }
}