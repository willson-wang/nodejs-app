import Koa from 'koa'
import logger from './logger/winston'

const app = new Koa()

app.use(async (ctx, next) => {
    ctx.body = 'hello world'
    await next()
})

logger.info('start app')

app.listen('3003', function () {
    console.log('app listen http://localhost:3003')
})