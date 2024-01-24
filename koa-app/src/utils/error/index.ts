import { BaseError } from "./baseError";
import { getLogger, BaseLogger } from "../logger";

export { BaseError } from './baseError'
export * from './httpError'


// 错误类型分类
// 操作错误，程序运行时抛的错，预期内的错误
// 程序错误，代码写的不好导致的错误，预期外的错误
// error模块要处理的就是预期内的错误

export class ErrorHandler {
    logger: BaseLogger
    constructor() {
        this.logger = getLogger()
    }

    handlerError(err) {
        // 打印日志
        this.logger.error(err)
        // 其它操作
    }

    isTrustedError(err) {
        if (err instanceof BaseError) {
            return err.isTrusted
        }
        return false
    }
}

let errorHandler;
export function useError() {
    return errorHandler = new ErrorHandler()
}

export function getErrorHandler() {
    if (!errorHandler) {
        throw new Error("请先使用useError初始化errorHandler实例");
        
    }
    return errorHandler
}