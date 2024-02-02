import { Context } from 'koa';
import { Get, JsonController, Post, QueryParam, Body, Ctx, BodyParam } from "routing-controllers";
import { getJwtInstance, injectToken } from '../utils/jwt'
import { HTTPError } from '../utils/error'
import { AuthenticationMethod, timeTypeEnum, dateSource, Page, newTimeTypeEnum, QP } from '../common.type'

@JsonController('/main')
export default class MainController {

    @Get('/get-token')
    async getToken(@Ctx() ctx: Context) {
        const jwt = getJwtInstance();
        
        const token = await jwt.sign({
            name: 'xiaoming1',
            age: 18
        })

        injectToken(token, ctx)

        return { token }
    }

    @Get('/test')
    test(
        @QueryParam('id', {required: false}) id: string,
        @QueryParam('page') page: number,
        @QueryParam('method') method?: AuthenticationMethod,
        @QueryParam('type', { type: 'string' }) type?: timeTypeEnum,
    ) {
        if(!id) {
            throw new HTTPError({
                message: `id不能为空`,
                code: -1
            })
        }
        return `id:${id}, pid: ${process.pid}, page: ${page}, method: ${method}, type: ${type}`
    }

    @Get('/list')
    list(
        @QueryParam('page') page?: Page,
    ): any {
        console.log('method', page);
        return 'hello world' + page
    }

    @Post('/save-world')
    saveHello(
        @BodyParam('data') data?: dateSource
    ): any {
        return 'hello world' + JSON.stringify(data)
    }

    @Get('/test1')
    test1(
        @QueryParam('type') type?: newTimeTypeEnum,
        @QueryParam('isTure') isTure = true,
    ): any {
        console.log('method', type, isTure);
        return 'hello test' + type + isTure
    }

    @Post('/submit')
    submit(@Body() data: Record<string, any>) {
        console.log('data', data);
        return data
    }
}