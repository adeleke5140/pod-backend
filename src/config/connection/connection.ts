import mongoose, { ConnectionOptions } from 'mongoose';

import { appConfig } from '../env';
import { logger } from '../../util/logger';

interface IConnectOptions extends ConnectionOptions {}

const podFullName: string = [process.env.K8S_POD_NAME, process.env.K8S_POD_IP, process.env.K8S_NODE_NAME].filter((e) => e).join('_') || appConfig.name;

const connectOptions: IConnectOptions = {
  bufferCommands: true,
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  promiseLibrary: global.Promise,
  appname: podFullName,
  sslValidate: false,
  // poolSize: 7,
};

const mongoURI: string = appConfig.mongodb.uri;

// todo integrate logger with env
mongoose.connect(mongoURI, connectOptions, (error: Error): void => {
  if (error) {
    logger.info(`MongoDB :: initial connection error ${JSON.stringify(error)}`);
  }
});

// handlers
mongoose.connection.on('connecting', (): void => {
  logger.info('MongoDB :: connecting');
});

mongoose.connection.on('error', (error: Error): void => {
  logger.error(`MongoDB :: connection error ${JSON.stringify(error)}`);
  if (error.name === 'MongooseServerSelectionError') {
    process.exit(1);
  }
  // mongoose.disconnect().then();
});

mongoose.connection.on('connected', (): void => {
  mongoose.set('debug', !!appConfig.isDevelopment);
  logger.info('MongoDB :: connected');
});

mongoose.connection.on('reconnected', (): void => {
  logger.warn('MongoDB :: reconnected');
});

mongoose.connection.on('reconnectFailed', (): void => {
  logger.error('MongoDB :: reconnectFailed');
});

mongoose.connection.on('disconnected', (): void => {
  logger.warn('MongoDB :: disconnected');
});

mongoose.connection.on('fullsetup', (): void => {
  logger.info('MongoDB :: reconnecting... %d');
});
