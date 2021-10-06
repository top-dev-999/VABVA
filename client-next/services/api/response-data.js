export class ResponseData {
    constructor(response) {
        this._response = { data: {}, ...(response || {}) };
    }

    get error() {
        return this._response.data?.error;
    }

    get success() {
        return this._response.data?.success || this._response.data?.sucess;
    }

    get result() {
        return this._response.data?.result || this._response.data;
    }
}
