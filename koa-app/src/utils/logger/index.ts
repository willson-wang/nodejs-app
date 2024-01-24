import { PinoLogger } from './pinoLogger';
export { BaseLogger } from './baseLogger'
// 格式化
// 过滤敏感信息
// 切割
// 性能
// 多进程
let loggerInstance;

export function usePinoLogger(options) {
    loggerInstance = new PinoLogger(options).init()
    return loggerInstance
}

export function getLogger() {
    if (!loggerInstance) {
        throw new Error("请先使用usePinoLogger初始化logger实例");
        
    }
    return loggerInstance
}