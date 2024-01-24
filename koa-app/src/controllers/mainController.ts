import { Context } from 'koa';
import { Get, JsonController, Post, QueryParam, Body, Ctx } from "routing-controllers";
import { getJwtInstance, injectToken } from '../utils/jwt'
import { HTTPError } from '../utils/error'

@JsonController('/main')
export default class MainController {

    @Get('/get-token')
    async getToken(@Ctx() ctx: Context) {
        const jwt = getJwtInstance();
        
        const token = await jwt.sign({
            name: 'xiaoming',
            age: 18
        })

        injectToken(token, ctx)

        return { token }
    }

    @Get('/test')
    test(@QueryParam('id', {required: false}) id: string) {
        if(!id) {
            throw new HTTPError({
                message: `id不能为空`,
                code: -1
            })
        }
        return `id:${id}, pid: ${process.pid}`
    }

    @Post('/submit')
    submit(@Body() data: Record<string, any>) {
        console.log('data', data);
        return data
    }
}