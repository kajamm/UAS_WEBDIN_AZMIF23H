// src/utils/logger.ts
// Utilitas logging sederhana untuk aplikasi

import { env } from '../config/env';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const colors = {
  info: '\x1b[36m',  // Cyan
  warn: '\x1b[33m',  // Yellow
  error: '\x1b[31m', // Red
  debug: '\x1b[35m', // Magenta
  reset: '\x1b[0m',
};

const logger = {
  info: (message: string, ...args: unknown[]): void => {
    log('info', message, ...args);
  },
  warn: (message: string, ...args: unknown[]): void => {
    log('warn', message, ...args);
  },
  error: (message: string, ...args: unknown[]): void => {
    log('error', message, ...args);
  },
  debug: (message: string, ...args: unknown[]): void => {
    if (env.NODE_ENV === 'development') {
      log('debug', message, ...args);
    }
  },
};

function log(level: LogLevel, message: string, ...args: unknown[]): void {
  const timestamp = new Date().toLocaleString('id-ID');
  const color = colors[level];
  const reset = colors.reset;
  const prefix = `${color}[${level.toUpperCase()}]${reset}`;

  console.log(`${prefix} [${timestamp}] ${message}`, ...args);
}

export default logger;
