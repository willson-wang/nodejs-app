import winston from 'winston';

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ 
            dirname: 'log', filename: 'test.log' 
        }),
    ]
});

export default logger