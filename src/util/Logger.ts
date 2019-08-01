import winston from 'winston';
import moment from 'moment';

// https://stackoverflow.com/questions/47231677/how-to-log-full-stack-trace-with-winston-3
const errorStackFormat = winston.format(info => {
    if (info instanceof Error)
        info.message = `${info.message}\n${info.stack}`;
    return info;
});

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        errorStackFormat(),
        winston.format.printf(log => `[${log.level.toUpperCase()} | ${moment().format('hh:mm:ss A')}] - ${log.message}`)
    )
});

export default logger;