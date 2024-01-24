import path from 'path'
import 'reflect-metadata';
import Koa from 'koa'
import { useKoaServer } from 'routing-controllers'
import { parseCookie } from 'koa-cookies'

import { usePinoLogger } from './utils/logger'
import { useJwt } from './utils/jwt'
import { initGlobalErrorCatch } from './utils/globalErrorCatch'
import { useError } from './utils/error';

export async function initApp(options) {
    const config = require('./config/config.default').default
    console.log('config', config)

    const logger = usePinoLogger({})

    const errorHandler = useError()
    
    // 开启jwt功能
    console.log('config.jwt', config.jwt)
    useJwt(config.jwt)

    console.log(config.jwt, {b: 1, c: 2}, 'config.jwt1111')

    logger.info('开始启动服务', '6666')
    logger.trace('trace日志')
    logger.debug('debug日志')
    logger.warn('warn日志')
    logger.fatal('fatal日志')
    logger.access('请求access日志')

    initGlobalErrorCatch()

    const app = new Koa()

    app.use(async (ctx, next) => {
        ctx.config = config;
        // 注入errorHandler
        ctx.errorHandler = errorHandler;
        // 注入logger
        ctx.logger = logger;
        await next()
    })

    app.use(parseCookie())

    useKoaServer(app, {
        defaultErrorHandler: false,
        controllers: [path.join(__dirname + '/controllers/*.js')],
        middlewares: [path.join(__dirname + '/middlewares/*.js')]
    })
    
    const port = process.env.PORT || '3000'

    app.listen(port, () => {
        if (!options.isCluster) {
            console.log(`app runing address http://localhost:${port}`);
        }
    })
}