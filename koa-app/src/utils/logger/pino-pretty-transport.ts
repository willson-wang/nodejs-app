const pretty = require('pino-pretty')

const { createColors } = require('colorette')

const levelColorize = pretty.colorizerFactory(true)

const availableColors = createColors({ useColor: true })

const { magentaBright } = availableColors


export default opts => pretty({
    ...opts,
    // messageFormat: (log, messageKey) => `hello ${log[messageKey]}`
    customPrettifiers: {
        level: logLevel => {
            return logLevel === 70 ? magentaBright('ACCESS') : `${levelColorize(logLevel)}`
        },
        'err': (err) => {
            return err.stack ?? err.message ?? err; // this will be {}
        }
    }
})