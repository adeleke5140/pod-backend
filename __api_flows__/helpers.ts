import mongoose from 'mongoose';

import { logger } from '../src/util/logger';

export async function closeDbConnection() {
  logger.info('Closing database connection');

  await mongoose.connection.close();
}
