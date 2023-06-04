import mongoose, { ConnectionOptions, Mongoose } from 'mongoose';
import { logger } from '../../util/logger';
import { appConfig } from '../../config/env';

const connectOptions: ConnectionOptions = {
  bufferCommands: true,
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  poolSize: appConfig.mongodb.poolSize || 10,
};

// Connect and export the promise
export const mongoConnection: Promise<Mongoose> = mongoose.connect(appConfig.mongodb.uri, connectOptions).catch((error: Error) => {
  if (error) {
    logger.info(JSON.stringify(error));
  }
}) as Promise<Mongoose>;

// handlers
mongoose.connection.on('connecting', () => {
  logger.info('MongoDB :: connecting');
});

mongoose.connection.on('error', (error: Error) => {
  logger.error(`MongoDB :: connection ${JSON.stringify(error)}`);
  mongoose.disconnect().then();
});

mongoose.connection.on('connected', () => {
  mongoose.set('debug', (col: string, method: string, query: object, doc: object): void => {
    logger.info(`MongoDB :: ${col}.${method}(${JSON.stringify(query)},${JSON.stringify(doc)})`);
  });

  logger.info('MongoDB :: connected');
});

mongoose.connection.once('open', () => {
  logger.info('MongoDB :: connection opened');
});

mongoose.connection.on('reconnected', () => {
  logger.warn('MongoDB :: reconnected');
});

mongoose.connection.on('reconnectFailed', () => {
  logger.error('MongoDB :: reconnectFailed');
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB :: disconnected');
});
mongoose.connection.on('fullsetup', () => {
  logger.info('MongoDB :: reconnecting... %d');
});
