import Encoder from "./Encoder.js";

export default class JsonEncoder extends Encoder {
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