import { Context, Next } from 'koa'
import { Middleware, KoaMiddlewareInterface } from "routing-controllers";
import { BaseError } from '../utils/error';


@Middleware({type: 'before', priority: 31})
export class RequestErrorMiddleware implements KoaMiddlewareInterface {
    async use(ctx: Context, next: Next): Promise<any> {
        try {
            await next()
        } catch (err) {
            ctx.errorHandler.handlerError({
                act: 'request error',
                url: ctx.url,
                err
            })
            // console.error(err)
            this.handleError(ctx, err)
        }
    }

    processJsonError(error) {
        if (typeof error.toJSON === 'function')
            return error.toJSON();
        let processedError = {} as any;
        if (error instanceof Error) {
            const name = error.name && error.name !== 'Error' ? error.name : error.constructor.name;
            processedError.name = name;
            if (error.message)
                processedError.message = error.message;
            if (error.stack && process.env.NODE_ENV !== 'production')
                processedError.stack = error.stack;
            Object.keys(error)
                .filter(key => key !== 'stack' &&
                key !== 'name' &&
                key !== 'message' &&
                (key !== 'httpCode'))
                .forEach(key => (processedError[key] = error[key]));
            return Object.keys(processedError).length > 0 ? processedError : undefined;
        }
        return error;
    }

    processTextError(error) {
        if (error instanceof Error) {
            if (process.env.NODE_ENV !== 'production' && error.stack) {
                return `errMsg: ${error.message}\nstack: ${error.stack}`
            }
            else if (error.message) {
                return error.message;
            }
        }
        return error;
    }

    handleError(ctx, error: BaseError) {
        if (ctx) {
            Object.keys(ctx.headers).forEach(name => {
                ctx.response.set(name, ctx.headers[name]);
            });
        }
        // send error content
        if (ctx && ctx.config && ctx.config.error && ctx.config.error.isJsonTyped) {
            ctx.response.body = this.processJsonError(error);
        }
        else {
            ctx.response.body = this.processTextError(error);
        }
        // set http status
        const httpCode = ctx && ctx.config && ctx.config.error && ctx.config.error.httpCode;
        if (httpCode) {
            ctx.response.status = error.httpStatusCode || ctx.config.error.httpCode;
        } else {
            ctx.response.status = error.httpStatusCode || 500;
        }
    }
}