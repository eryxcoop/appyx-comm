import {Requester} from "./Requester";

export default class FakeRequester extends Requester {
  constructor({expectedResponses = {}, waitingTime = 2500}) {
    super();
    this._expectedResponses = expectedResponses;
    this._waitingTime = waitingTime;
  }

  addResponseFor({endpoint, response}) {
    this._expectedResponses[endpoint.constructor.name] = response;
  }

  _getResponseClassFor(endpoint) {
    return this._expectedResponses[endpoint.constructor.name];
  }

  _getExpectedResponseFor(endpoint) {
    const expectedResponseType = this._getResponseClassFor(endpoint);
    if (!expectedResponseType) {
      // for now, we are assuming that the first response is the default one
      return endpoint.responses()[0]
    }
    return expectedResponseType;
  }

  _getExpectedResponseContentFor(endpoint) {
    const expectedResponseType = this._getExpectedResponseFor(endpoint);
    return expectedResponseType.asDefaultResponse();
  }

  call({endpoint, data = undefined}) {
    const endpointResponse = this._getExpectedResponseContentFor(endpoint);
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(endpointResponse), this._waitingTime);
    })
  }
}