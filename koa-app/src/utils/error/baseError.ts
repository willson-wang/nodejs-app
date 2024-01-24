export enum HttpStatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER = 500,
}

export class BaseError extends Error {
    code: string;
    httpStatusCode: number;
    name: string;
    detail?: string;
    isTrusted?: boolean; 
    constructor({message, code, httpStatusCode, detail}: {
        message: string;
        code: string;
        httpStatusCode: number;
        detail?: string;
        isTrusted?: boolean;}
    ) {
        super()
        // 错误信息
        this.message = message;
        // 业务层面的错误码
        this.code = code;
        // http接口层面的错误码
        this.httpStatusCode = httpStatusCode;
        // 错误详情,rpc请求的时候有详情
        this.detail = detail;
        // 错误名称，区分不同的错误
        this.name = this.constructor.name
        // 错误是否是已知的，用于区分错误是否需要直接exit进程
        this.isTrusted = this.isTrusted || true;

        Error.captureStackTrace(this, this.constructor);
    }

    getCode() {
        return this.code
    }

    getJson() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            httpCode: this.httpStatusCode,
            detail: this.detail,
            stack: this.stack
        }
    }
}