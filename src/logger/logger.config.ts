import { ConfigService } from '@nestjs/config';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModuleOptions,
} from 'nest-winston';
import * as winston from 'winston';

// 🔹 Funktion för att hantera felaktiga värden i loggar
const safeString = (value: unknown): string =>
  typeof value === 'string' ? value : JSON.stringify(value) || 'N/A';

// 🟢 Säker hantering av `stack` (fix för TypeScript-felet)
const formatStackTrace = (stack: unknown): string[] => {
  if (!stack) return []; // Om stack saknas, returnera tom array
  const stackStr = String(stack); // Konvertera till string om det är ett objekt
  return stackStr.includes('\n') ? stackStr.split('\n') : [stackStr]; // Dela upp i rader
};

// 🟢 Anpassat loggformat för JSON-loggar (för prod)
const jsonErrorFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack, context }) => {
    return JSON.stringify({
      timestamp: safeString(timestamp),
      level: safeString(level),
      message: safeString(message),
      stack: formatStackTrace(stack), // 🟢 Nu TypeScript-säkert
      context: safeString(context),
    });
  }),
);

// 🟢 Anpassat loggformat för console-loggar (dev)
const prettyConsoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // 🔥 Lägger tillbaka timestamp
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack, context }) => {
    const stackInfo = stack
      ? `\n🔴 Stacktrace:\n${formatStackTrace(stack).join('\n')}`
      : ''; // 🔹 Stacktrace i röd färg
    return `[Resido] ${timestamp} [${safeString(level).toUpperCase()}] [${safeString(context)}] ${safeString(message)} ${stackInfo}`;
  }),
);

export const createWinstonOptions = (
  configService: ConfigService,
): WinstonModuleOptions => {
  const isProduction =
    configService.get<string>('app.environment') === 'production';

  const transports: winston.transport[] = [];

  if (!isProduction) {
    // ✅ Development: Console-loggning med färg & timestamp
    transports.push(
      new winston.transports.Console({
        level: 'debug',
        format: prettyConsoleFormat, // 🔥 FIXAR TIMESTAMP I CONSOLE
      }),
    );
  } else {
    // ✅ Production: Loggar endast till filer (ingen console)
    transports.push(
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: jsonErrorFormat,
      }),
    );

    transports.push(
      new winston.transports.File({
        filename: 'logs/combined.log',
        level: 'info',
        format: prettyConsoleFormat,
      }),
    );
  }

  return { transports };
};
