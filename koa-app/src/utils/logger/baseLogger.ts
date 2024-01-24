import path from 'path'
import fs from 'fs'

interface LogOptions {

}

export abstract class BaseLogger {
    options: LogOptions;
    logDirectory: string;
    logger: BaseLogger

    abstract init(): this

    abstract getInstance(): BaseLogger

    abstract info(...args): void

    abstract error(...args): void

    abstract log(...args): void

    abstract trace(...args): void

    abstract debug(...args): void

    abstract warn(...args): void

    abstract fatal(...args): void

    abstract access(...args): void

    setLogDir() {
        this.logDirectory = path.join(__dirname, '../../logs');
        if (!fs.existsSync(this.logDirectory)) {
            fs.mkdirSync(this.logDirectory)
        }
    }

    proxyConsole() {
        const that = this;
        const originLog = console.log.bind(console)
        // 劫持console
        Object.defineProperties(console, {
            log: {
                get() {
                    return that.log.bind(that)
                },
            },
            info: {
                get() {
                    return that.log.bind(that)
                },
            },
            error: {
                get() {
                    return that.error.bind(that)
                },
            },
            warn: {
                get() {
                    return that.warn.bind(that)
                },
            },
            debug: {
                get() {
                    return that.debug.bind(that)
                },
            },
            trace: {
                get() {
                    return that.trace.bind(that)
                },
            },
            access: {
                get() {
                    return that.access.bind(that)
                },
            },
            log1: {
                get() {
                    return function(...args) {
                        originLog(...args)
                        // that.log(...args)
                    }
                }
            }
        })

    }
}