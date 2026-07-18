import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/db.js';
import Agency from '../models/Agency.js';
import { logoForDomain } from '../services/logoService.js';
import { validateWebsite } from '../services/websiteService.js';

const concurrency = Math.max(1, Number(process.env.WEBSITE_VALIDATION_CONCURRENCY) || 10);
const agencies = await (async () => {
  await connectDatabase();
  return Agency.find({ isPublished: true }).select('_id website').lean();
})();

let next = 0;
const updates = [];
await Promise.all(Array.from({ length: concurrency }, async () => {
  while (next < agencies.length) {
    const agency = agencies[next++];
    const metadata = await validateWebsite(agency.website);
    updates.push({
      updateOne: {
        filter: { _id: agency._id },
        update: { $set: { ...metadata, verifiedWebsite: metadata.websiteVerified, logo: logoForDomain(metadata.domain), logoFetchedAt: new Date() } },
      },
    });
  }
}));

if (updates.length) await Agency.bulkWrite(updates, { ordered: false });
console.info(`Validated and refreshed metadata for ${updates.length} agencies.`);
await mongoose.disconnect();
