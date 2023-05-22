import { createLogger, transports, format, config } from 'winston';

const logger = createLogger({
  levels: config.syslog.levels,
  transports: [new transports.Console()],
  level: process.env.LOGGER_LEVEL ?? 'info',
  format: process.env.LOGGER_FORMAT === 'human'
    ? format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`;
        })
      )
    : format.json(),
});

export default logger;
