

export default class StrategicFakeResponseFactory {

    constructor(responses, defaultResponse) {
        this._responses = responses
        this._defaultResponse = defaultResponse;
        this._countOfGivenResponses = 0;
    }

    static newWith(responses, defaultResponse) {
        return new this(responses, defaultResponse)
    }

    static newAlwaysResponding(defaultResponse) {
        return new this.newWith([], defaultResponse)
    }

    asDefaultResponse() {
        const response = this._responses[this._countOfGivenResponses] || this._defaultResponse;
        this._countOfGivenResponses += 1;
        return response.asDefaultResponse()
    }
}