import { Context, Next } from 'koa'
import { Middleware, KoaMiddlewareInterface } from "routing-controllers";

@Middleware({type: 'before', priority: 30})
export class RequestLogMiddleware implements KoaMiddlewareInterface {
    async use(ctx: Context, next: Next): Promise<any> {
        const info = {
            act: 'req start',
            url: ctx.url,
            query: ctx.query
        } as Record<string, any>
        if (ctx.body) {
            info.body = ctx.body
        }
        console.access(info)
        await next()
        console.access({
            act: 'req end', 
            url: ctx.url,
        })
    }
}