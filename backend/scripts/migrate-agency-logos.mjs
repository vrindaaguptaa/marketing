import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/db.js';
import Agency from '../models/Agency.js';
import { domainForWebsite, logoForDomain } from '../services/logoService.js';

await connectDatabase();
const agencies = await Agency.find({ isPublished: true }).select('_id website domain logo').lean();
const updates = agencies.flatMap((agency) => {
  const domain = agency.domain || domainForWebsite(agency.website);
  if (!domain) return [];
  const canonicalLogo = logoForDomain(domain);
  // Rebuild legacy Logo.dev URLs too, so the stored source uses the configured
  // token and PNG format; initials remain a client-only loading fallback.
  if (agency.logo === canonicalLogo) return [];
  return [{ updateOne: { filter: { _id: agency._id }, update: { $set: { domain, logo: canonicalLogo, logoFetchedAt: new Date() } } } }];
});
if (updates.length) await Agency.bulkWrite(updates, { ordered: false });
console.info(`Updated stored Logo.dev URLs for ${updates.length} agencies.`);
await mongoose.disconnect();
