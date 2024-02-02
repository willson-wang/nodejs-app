import path from 'path'
import fs from 'fs'
import { BaseLogger } from './baseLogger'


export class PinoLogger extends BaseLogger {
    constructor(options: {}) {
        super();
        this.options = options
    }

    init() {
        this.setLogDir()
        this.logger = this.getInstance()
        this.proxyConsole()
        return this
    }

    getInstance() {
        
        const { getStream } = require('file-stream-rotator')
        const pretty = require('pino-pretty')
        const Pino = require('pino');

        const isProd = process.env.NODE_ENV === 'production'

        if (!isProd) {
            return new Pino({ 
                level: 'info',
                customLevels: {
                    access: 70
                },
                // transport: {
                //     target: 'pino-pretty',
                //     // target: './pino-pretty-transport',
                //     options: {
                //         colorize: true,
                //         singleLine: false, // 控制台日志单行显示
                //     }
                // },
                timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
                base: undefined,
                // nestedKey: 'data',
            })
        }

        const streams = [
            process.env.NODE_ENV === 'production' || process.env.LOG_OUTPUT_CONSOLE ? null : {stream: pretty()},
            // { level: 'access', stream: fs.createWriteStream(`${this.logDirectory}/access.log`) },
            // { level: 'info', stream: fs.createWriteStream(`${this.logDirectory}/bussiness.log`) },
            // { level: 'error', stream: fs.createWriteStream(`${this.logDirectory}/error.log`) },
            { level: 'access', stream: getStream({
                filename: `${this.logDirectory}/access.log.%DATE%`,
                frequency: "daily",
                date_format: "YYYY-MM-DD", 
            })},
            { level: 'info', stream: getStream({
                filename: `${this.logDirectory}/bussiness.log.%DATE%`,
                frequency: "daily",
                date_format: "YYYY-MM-DD", 
            })},
            { level: 'error', stream: getStream({
                filename: `${this.logDirectory}/error.log.%DATE%`,
                frequency: "daily",
                date_format: "YYYY-MM-DD", 
            })},
        ].filter(item => item);

        
        return new Pino({ 
            level: 'trace',
            customLevels: {
                access: 70
            },
            timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
            // redact: {
            //     // these are just clutter
            //     paths: ['pid', 'hostname', 'level'],
            //     remove: true
            // },
            base: undefined,
            nestedKey: 'data',
            // formatters: {
            //     log (object) {
            //         return { ...object, a: 1 } 
            //     }
            // }
        }, Pino.multistream(streams, {dedupe: true, levels: {
            silent: Infinity,
            access: 70,
            fatal: 60,
            error: 50,
            warn: 40,
            info: 30,
            debug: 20,
            trace: 10,
        }}));
    }

    formatArgs(args: any[]): any[] {
        if (!args.length) return args
        // pino的传入的参数格式是log(string), log(obj), log(obj, string)，对于log(string, obj)这种场景会将obj也当成一个字符串,对于log(string, string)会忽略第二个参数，所以这里需要修正一下传入的参数
        switch(args.length) {
            case 1:
                return args;
            case 2:
                if (typeof args[0] === 'string' && typeof args[1] === 'string') {
                    return [{
                        0: args[0],
                        1: args[1],
                    }]
                } else if (typeof args[0] === 'string' && typeof args[1] === 'object') {
                    return args.reverse()
                } 
                return args;
            default:
                const newArgs = args.reduce((prev, item, idx) => {
                    prev[idx] = item
                    return prev
                }, {});
                return [newArgs];
        }
    }

    info(...args) {
        this.logger.info(...this.formatArgs(args))
    }

    error(...args) {
        this.logger.error(...args)
    }

    log(...args) {
        this.logger.info(...this.formatArgs(args))
    }
    trace(...args) {
        this.logger.trace(...args)
    }
    debug(...args) {
        this.logger.debug(...args)
    }
    warn(...args) {
        this.logger.warn(...args)
    }
    fatal(...args) {
        this.logger.fatal(...args)
    }
    access(...args) {
        this.logger.access(...args)
    }
}
