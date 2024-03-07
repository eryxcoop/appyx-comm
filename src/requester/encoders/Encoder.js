export default class Encoder {
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

