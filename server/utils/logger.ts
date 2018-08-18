import { Logger, LoggerInstance, LoggerOptions, TransportInstance, transports } from 'winston';
import { Process } from './process';

const transportInstance: TransportInstance = new transports.Console();
transportInstance.silent = Process.isTest();

export const logger: LoggerInstance = new Logger({
    exitOnError: false,
    transports: [],
} as LoggerOptions);
