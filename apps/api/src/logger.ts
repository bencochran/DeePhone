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

export function loggableError(error: any) {
  return {
    string: error.toString(),
    raw: error,
  };
}


export function omit<T extends {}>(object: T, omittedKeys: (keyof T)[] | keyof T) {
  const omittedKeysArray = Array.isArray(omittedKeys) ? omittedKeys : [omittedKeys];
  return Object.fromEntries(
    Object
      .keys(object)
      .map(k => k as keyof T)
      .filter(k => !omittedKeysArray.includes(k))
      .map(k => [k, object[k]])
  );
}

export default logger;
