import {Requester} from "./Requester";
import UnexpectedErrorResponse from "../responses/generalResponses/UnexpectedErrorResponse";

class RemoteRequester extends Requester {
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

        return fetch(this._baseUrl + url, request).then(result => result.json())
            .then(jsonResponse => {
                return this._buildResponse(jsonResponse, endpoint)
            })
    }

    _buildRequest(endpoint, data) {
        let headers = this._buildHeadersFor(endpoint);
        let requestOptions = {
            method: endpoint.method(),
            headers: headers,
            // credentials: 'include', // include cookie credentials
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
            headers['Authorization'] = 'Token ' + this._authorizationManager.token();
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
        this._convertModelToFormData(requestBody, formData, '');
        return formData;
    }

    _isAList(value) {
        return Array.isArray(value)
    }

    _isAListOfFiles(value) {
        return this._isAList(value) && value.every((aPotencialFile) => aPotencialFile instanceof File)
    }

    _addListToData(aList, field, formData) {
        // Django no interpreta correctamente las lista de jsons. Por eso el uso de stringify
        // aList.forEach((item, index) => {
        //     this._convertModelToFormData(item, formData, `${field}[${index}]`);
        // })
        formData.append(field, JSON.stringify(aList));
        return formData
    }

    _addFilesToData(files, field, formData) {
        files.forEach( (file, index) => {
            const fieldName = field !== '' ? field : index.toString();
            formData.append(fieldName, file, file.name)
        });
        return formData
    }

    _convertModelToFormData(value, formData, namespace) {
        if (value !== undefined) {
            if (value instanceof Date) {
                formData.append(namespace, value.toISOString());
            } else if (this._isAListOfFiles(value)) {
                this._addFilesToData(value, namespace, formData);
            } else if (value instanceof Array) {
                this._addListToData(value, namespace, formData);
            } else if (typeof value === 'object' && !(value instanceof File)) {
                for (let propertyName in value) {
                    this._convertModelToFormData(value[propertyName], formData, namespace ? `${namespace}[${propertyName}]` : propertyName);
                }
            } else if (value instanceof File) {
                formData.append(namespace, value, value.name)
            } else {
                formData.append(namespace, value.toString());
            }
        }
        return formData;
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

export default RemoteRequester;