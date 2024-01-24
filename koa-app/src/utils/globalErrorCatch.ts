import { getLogger } from './logger'
import { getErrorHandler } from './error'

export function initGlobalErrorCatch() {
    const errorHandler = getErrorHandler()
    const logger = getLogger();
    // 监听全局错误
    process.on('uncaughtException', function (err) {
        errorHandler.handlerError(err)
        if (!errorHandler.isTrustedError(err)) {
            logger.info(`uncaughtException 出现未被信任错误, ${err.message}, 因此触发exit(1)`)
            process.exit(1)
        }
    })
    
    // 监听全局异步错误
    process.on('rejectionHandled', function (err) {
        errorHandler.handlerError(err)
        if (!errorHandler.isTrustedError(err)) {
            logger.info(`rejectionHandled 出现未被信任错误, ${err}, 因此触发exit(1)`)
            process.exit(1)
        }
    })


    // 监听exit事件，打印exit链路
    process.on('exit', function (code) {
        if (code) {
            logger.info('劫持 process.exit code', code)
            try {
                throw new Error('打印exit链路')
            } catch (error) {
                logger.error(error, `### error: 程序被process.exit(${code})中断，请排查中断原因,中断调用栈如下所示!`)
            }
        }
    })

}