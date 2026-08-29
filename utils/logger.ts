import fs from 'fs';
import path from 'path';
import winston from 'winston';

const logDir = path.resolve(process.cwd(), 'logs');
const logFilePath = path.join(logDir, 'test.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
    }),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: logFilePath }),
  ],
});
