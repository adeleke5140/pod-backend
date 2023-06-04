import * as fs from 'fs';
import { logger } from '../util/logger';
import * as Path from 'path';
import { mongoConnection } from './utils/db';
import { Mongoose } from 'mongoose';
(async function (args) {
  // check if the file exist
  const filename: string = args.length === 3 ? args[args.length - 1] : args[args.length - 1];
  const mongoObj: Mongoose = await mongoConnection;
  logger.info('Running command ', filename);
  const filePath: string = `${filename}.cmd.ts`;
  const exist: boolean = fs.existsSync(Path.dirname(filePath));
  console.log({ exist, filePath });
  if (!exist) {
    logger.error('command does not exist');
    process.exit(0);
  }
  // run the command .run function
  logger.info('command found ..........');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const command: any = Object.values(require('./' + filePath))[0];
  logger.info('command title: ', command?.name);
  logger.info('command description: ', command?.description);
  command
    .run(args)
    .then(async () => {
      logger.info('command completed successfully');
      await mongoObj.connection.close();
      process.exit(0);
    })
    .catch(async (e: Error) => {
      logger.info('!!! Error occurred while running the command');
      logger.error(`!!! ${e.message}`);
      logger.error(e.stack);
      await mongoObj.connection.close();
      process.exit(1);
    });
})(process.argv);
