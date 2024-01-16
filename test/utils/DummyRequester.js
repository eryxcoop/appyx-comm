import {Requester} from "../../src/requester/Requester.js";

export class DummyRequester extends Requester {
    constructor(expectedResponses) {
        super();
        this._expectedResponses = expectedResponses;
    }

    setExpectedResponses(expectedResponses) {
        this._expectedResponses = expectedResponses;
    }

    call({endpoint, data = undefined}) {
        return this._expectedResponses;
    }
}