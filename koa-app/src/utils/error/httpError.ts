import { BaseError, HttpStatusCode } from "./baseError";

export class HTTP400Error extends BaseError {
    constructor({message, code}) {
        super({
            message,
            code, 
            httpStatusCode: HttpStatusCode.BAD_REQUEST,
        })
    }
}

export class HTTP500Error extends BaseError {
    constructor({message, code}) {
        super({
            message,
            code, 
            httpStatusCode: HttpStatusCode.INTERNAL_SERVER,
        })
    }
}

export class HTTP404Error extends BaseError {
    constructor({message, code}) {
        super({
            message,
            code, 
            httpStatusCode: HttpStatusCode.NOT_FOUND,
        })
    }
}


export class HTTPError extends BaseError {
    constructor({message, code}) {
        super({
            message,
            code, 
            httpStatusCode: HttpStatusCode.OK,
        })
    }
}