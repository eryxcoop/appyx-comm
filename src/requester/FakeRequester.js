import {Requester} from "./Requester";

export default class FakeRequester extends Requester {
    constructor(expectedResponses) {
        super();
        this._expectedResponses = expectedResponses;
    }

    call({endpoint, data = undefined}) {
        const expectedResponseType = this._expectedResponses[endpoint.constructor.name];
        // TODO: Agregar response por defecto si no está definida en el diccionario
        const endpointResponse = expectedResponseType.asDefaultResponse();
        return new Promise( (resolve, reject) => {
            setTimeout(() => resolve(endpointResponse), 2500);
        })

    }
}