import {Requester} from "./Requester";

export default class FakeRequester extends Requester {
  constructor(expectedResponses = {}) {
    super();
    this._expectedResponses = expectedResponses;
  }

  addStrategicFakeResponseWith({endpoint, response}) {
    this._expectedResponses[endpoint.constructor.name] = response;
  }

  call({endpoint, data = undefined}) {
    const expectedResponseType = this._expectedResponses[endpoint.constructor.name];
    let endpointResponse;
    if (!expectedResponseType) {
      endpointResponse = endpoint.responses()[0].asDefaultResponse();
    } else {
      endpointResponse = expectedResponseType.asDefaultResponse();
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(endpointResponse), 2500);
    })

  }
}