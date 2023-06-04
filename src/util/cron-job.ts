import cron from 'node-cron';

export function cronJobHandler(ttls: string, fn: () => Promise<void>): void {
  cron.schedule(ttls, async () => {
    await fn();
  });
}
