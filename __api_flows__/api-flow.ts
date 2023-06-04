import { closeDbConnection } from './helpers';

(async () => {
  await closeDbConnection();

  process.exit();
})();
