import http from 'http';

import { app as server } from './server';
import { appConfig } from '../env';
import { onError, onExit, onListening, onTerminate, onUncaughtException, onUnhandledRejection } from './server-handlers';

const serverInstance: http.Server = http.createServer(server);

// Binds and listens for connections on the specified host
serverInstance.listen(appConfig.port);

// Register server events
serverInstance.on('error', (error: Error): void => onError(error, appConfig.port));
serverInstance.on('listening', onListening.bind(serverInstance));

// Register process events
process.on('exit', onExit.bind(serverInstance));
process.on('SIGINT', onTerminate.bind(serverInstance));
process.on('uncaughtException', onUncaughtException.bind(serverInstance));
process.on('unhandledRejection', onUnhandledRejection.bind(serverInstance));
