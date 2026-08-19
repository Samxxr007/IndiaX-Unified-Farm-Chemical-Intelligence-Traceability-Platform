import pino from 'pino';
import { env } from '../config/env';

export const logger = pino({
  level: env.LOG_LEVEL,
  transport:
    env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:HH:MM:ss',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  base: { service: 'indiax-backend' },
  redact: {
    paths: ['req.headers.authorization', 'body.password', 'body.passwordHash'],
    censor: '[REDACTED]',
  },
});
