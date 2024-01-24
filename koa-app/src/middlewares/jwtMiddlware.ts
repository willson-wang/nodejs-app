import { Context, Next } from 'koa'
import { Middleware, KoaMiddlewareInterface } from "routing-controllers";
import { getJwtInstance, injectToken } from '../utils/jwt'

@Middleware({type: 'before', priority: 20})
export class JwtMiddleware implements KoaMiddlewareInterface {
    async use(ctx: Context, next: Next): Promise<any> {
        if (ctx.config && !ctx.config.jwt) {
           return await next()
        }

        const url = ctx.request.url
        const { unVerifyUrls } = ctx.config.jwt
        if (unVerifyUrls.includes(url)) {
            return await next()
        }

        const jwt = getJwtInstance()

        const { Authorization } = ctx.headers

        const authorization = ctx.cookies.get('authorization');
        console.log({Authorization, authorization})

        const decoded = await jwt.verify(Authorization || authorization);

        const needResign = jwt.reSign(decoded)

        const { iat, exp, ...payload} = decoded

        console.log({needResign})
        if (needResign) {
            const token = await jwt.sign(payload);

            injectToken(token, ctx)
        }
        
        ctx.state.payload = payload
        
        await next()
    }
}