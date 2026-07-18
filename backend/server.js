import 'dotenv/config';
import cron from 'node-cron';
import app from './app.js';
import { connectDatabase } from './config/db.js';
import { purgeExpiredCaches } from './services/discoveryService.js';
import { seedAgenciesIfEmpty } from './services/seedService.js';

const start = async () => {
  if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) throw new Error('JWT_SECRET is required in production.');
  await connectDatabase();
  const seedReport = await seedAgenciesIfEmpty();
  if (seedReport.seeded) console.info(`Seeded ${seedReport.count} agencies; enriched ${seedReport.enriched} GitHub organizations.`);
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.info(`API listening on :${port}`));
  if (process.env.CACHE_CRON !== 'disabled') {
    cron.schedule(process.env.CACHE_CRON || '0 3 * * *', () => purgeExpiredCaches().catch((error) => console.error('Cache cleanup failed:', error.message)), { timezone: process.env.CACHE_TIMEZONE || 'UTC' });
  }
};
start().catch((error) => { console.error('Unable to start API:', error.message); process.exit(1); });
