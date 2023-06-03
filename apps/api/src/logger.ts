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

export interface LoggableObjectOptions {
  maxDepth?: number;
  maxArrayLength?: number;
  maxObjectProperties?: number;
  maxStringLength?: number;
}

export function loggableObject(object: any, { maxDepth = 5, ...options }: LoggableObjectOptions = {}): any {
  if (object === null) {
    return null;
  }

  const {
    maxArrayLength = 10,
    maxObjectProperties = 50,
    maxStringLength = 400,
  } = options;

  if (maxDepth === 0) {
    const string = `${object}`;
    if (string.length > maxStringLength) {
      return string.slice(0, maxStringLength) + `… (${string.length - maxStringLength} more characters)`;
    } else {
      return string;
    }
  }

  if (Array.isArray(object)) {
    return object
      .slice(0, maxArrayLength)
      .map(v => loggableObject(v, { maxDepth: maxDepth - 1, ...options }))
      .concat(object.length > maxArrayLength ? `… ${object.length - maxArrayLength} more`: [])
  }
  if (typeof object === 'object') {
    if (object.toString !== Object.prototype.toString) {
      const string = object.toString();
      if (string.length > maxStringLength) {
        return string.slice(0, maxStringLength) + `… (${string.length - maxStringLength} more characters)`;
      } else {
        return string;
      }
    }
    const entries = Object.entries(object);
    return Object.fromEntries(
      entries
        .slice(0, maxObjectProperties)
        .map(([k, v]) =>
          [k, loggableObject(v, { maxDepth: maxDepth - 1, ...options })])
        .concat([entries.length > maxObjectProperties ? ['__and__', `… ${entries.length - maxArrayLength} more`] : []]));
  }
  const string = `${object}`;
  if (string.length > maxStringLength) {
    return string.slice(0, maxStringLength) + `… (${string.length - maxStringLength} more characters)`;
  } else {
    return string;
  }
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
