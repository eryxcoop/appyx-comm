import {Requester} from "./Requester";
import UnexpectedErrorResponse from "../responses/generalResponses/UnexpectedErrorResponse";


export default class RemoteRequester extends Requester {
    constructor(url, authorizationManager) {
        super();
        this._baseUrl = url;
        this._authorizationManager = authorizationManager;
    }

    call({endpoint, data = undefined}) {
        const request = this._buildRequest(endpoint, data);
        let url = endpoint.url();
        if (endpoint.isGetMethod() && data) {
            url += "?" + this._dataToQueryString(data);
        }

        return fetch(this._baseUrl + "/" + url, request).then(result => result.json())
            .then(jsonResponse => {
                return this._buildResponse(jsonResponse, endpoint)
            })
    }

    _buildRequest(endpoint, data) {
        let headers = this._buildHeadersFor(endpoint);
        let requestOptions = {
            method: endpoint.method(),
            headers: headers,
            credentials: 'include', // include cookie credentials
        };

        if (endpoint.method() !== 'GET') {
            let encoder = this._encoderFor(endpoint.contentType());
            Object.assign(headers, encoder.headers());
            Object.assign(requestOptions, {body: encoder.encode(data)});
        }

        return requestOptions;
    }

    _buildResponse(jsonResponse, endpoint) {
        const availableResponsesForEndpoint = endpoint.responses();
        for (let responseType of availableResponsesForEndpoint) {
            if (responseType.understandThis(jsonResponse)) {
                return new responseType(jsonResponse);
            }
        }
        return new UnexpectedErrorResponse(jsonResponse);
    }

    _buildHeadersFor(endpoint) {
        let headers = {};
        if (endpoint.contentType() && endpoint.contentType() !== "multipart/form-data") {
            headers['Content-Type'] = endpoint.contentType();
        }

        if (endpoint.needsAuthorization()) {
            this._authorizationManager.configureHeaders(headers);
        }

        return headers;
    }

    _dataToQueryString(data) {
        let keyValuePairs = [];
        for (let i = 0; i < Object.keys(data).length; i += 1) {
            let key = Object.keys(data)[i];
            let value = Object.values(data)[i];
            if (value) {
                keyValuePairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
            }
        }
        return keyValuePairs.join('&');
    }

    _encoderFor(contentType) {
        let encoders = [new JsonEncoder(), new MultiPartEncoder()];
        return encoders.find(enc => enc.accepts(contentType));
    }
}

class Encoder {
    accepts(mimeType) {
        throw new Error("You have to implement the method");
    }

    headers() {
        throw new Error("You have to implement the method");
    }

    encode(requestBody) {
        throw new Error("You have to implement the method");
    }
}

class MultiPartEncoder extends Encoder {
    accepts(mimeType) {
        return mimeType === 'multipart/form-data'
    }

    headers() {
        return {}
    }

    encode(requestBody) {
        let formData = new FormData();

        for (let field in requestBody) {
            let value = requestBody[field];

            if (value !== undefined) {
                formData.append(field, value);
            }
        }

        return formData;
    }

    _generateBodyFromFiles(files) {
        let formData = new FormData();
        Object.keys(files).forEach(key => {
            const file = files[key];
            formData.append(key, file);
        });
        return formData
    }
}

class JsonEncoder extends Encoder {
    accepts(mimeType) {
        return mimeType === 'application/json'
    }

    headers() {
        return {'Content-Type': 'application/json'}
    }

    encode(requestBody) {
        return JSON.stringify(requestBody);
    }
}

