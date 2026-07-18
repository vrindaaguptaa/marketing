import Agency from '../models/Agency.js';
import agencies from '../data/agencies.json' with { type: 'json' };
import { getGithubOrganization } from './githubService.js';
import { refreshRankings } from './rankingService.js';
import { logoForDomain } from './logoService.js';
import { validateWebsite } from './websiteService.js';

// const mapAgency = (record) => ({
//   name: record.companyName, normalizedName: record.companyName.toLowerCase().replace(/[^a-z0-9]/g, ''), website: record.website, logo: record.logoUrl,
//   description: record.description, location: { city: record.city, state: record.state, country: record.country }, technologies: record.technologies, services: record.services,
//   employees: record.companySize, yearsInBusiness: record.yearsInBusiness ?? new Date().getFullYear() - record.foundedYear, experienceYears: record.yearsInBusiness ?? new Date().getFullYear() - record.foundedYear,
//   rating: record.rating, reviewsCount: record.reviewCount, portfolioLinks: record.portfolio, githubOrg: record.githubOrganization,
//   socialLinks: record.socialLinks, featuredImage: record.featuredImage, verifiedWebsite: Boolean(record.website),
//   external: { fetchedAt: new Date(), expiresAt: new Date(Date.now() + 86400000) }, source: { name: 'Built-in agency seed', url: record.website, lastFetchedAt: new Date() }, isPublished: true,
// });



const currentYear = new Date().getFullYear();

const toNumber = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
};

const calculateYears = (record) => {
  const years = toNumber(record.yearsInBusiness);
  if (years !== undefined) return years;

  const founded = toNumber(record.foundedYear);
  if (founded !== undefined) return currentYear - founded;

  return undefined;
};

const mapAgency = (record, websiteMetadata = {}) => {
  const years = calculateYears(record);
  const domain = websiteMetadata.domain;

  return {
    name: record.companyName,
    normalizedName: record.companyName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, ''),

    website: websiteMetadata.website || record.website,
    logo: logoForDomain(domain),
    domain,
    logoFetchedAt: new Date(),

    description: record.description,

    location: {
      city: record.city,
      state: record.state,
      country: record.country
    },

    technologies: record.technologies || [],
    services: record.services || [],

    employees: toNumber(record.companySize),

    yearsInBusiness: years,
    experienceYears: years,

    rating: toNumber(record.rating) ?? 0,
    reviewsCount: toNumber(record.reviewCount) ?? 0,

    portfolioLinks: record.portfolio || [],

    githubOrg: record.githubOrganization,

    socialLinks: record.socialLinks || {},

    featuredImage: record.featuredImage,

    verifiedWebsite: Boolean(websiteMetadata.websiteVerified),
    websiteVerified: Boolean(websiteMetadata.websiteVerified),

    external: {
      fetchedAt: new Date(),
      expiresAt: new Date(Date.now() + 86400000)
    },

    source: {
      name: 'Built-in agency seed',
      url: record.website,
      lastFetchedAt: new Date()
    },

    isPublished: true
  };
};

export const enrichGithubAgencies = async (limit = 30) => {
  if (!process.env.GITHUB_TOKEN) return 0;
  const agenciesToEnrich = await Agency.find({ githubOrg: { $exists: true, $ne: '' } }).sort({ 'external.github.updatedAt': 1 }).limit(limit);
  let enriched = 0;
  for (const agency of agenciesToEnrich) {
    try { const github = await getGithubOrganization(`https://${agency.githubOrg}.github.io`); if (github) { agency.external.github = github; agency.external.fetchedAt = new Date(); agency.external.expiresAt = new Date(Date.now() + 86400000); await agency.save(); enriched += 1; } } catch { /* GitHub absence/rate limits must not block startup. */ }
  }
  return enriched;
};

const mapWithValidatedWebsites = async () => {
  const concurrency = 12;
  const docs = new Array(agencies.length);
  let next = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (next < agencies.length) {
      const index = next++;
      docs[index] = mapAgency(agencies[index], await validateWebsite(agencies[index].website));
    }
  }));
  return docs.filter((doc) => doc.name && doc.normalizedName);
};

export const seedAgenciesIfEmpty = async () => {
  const replaceBuiltInSeed = process.env.REPLACE_SEED === 'true';
  if (await Agency.exists({})) {
    if (!replaceBuiltInSeed) return { seeded: false, count: 0, enriched: 0 };
    await Agency.deleteMany({ 'source.name': 'Built-in agency seed' });
  }
  // await Agency.insertMany(agencies.map(mapAgency), { ordered: true });


  // const docs = agencies.map(mapAgency);

  const docs = await mapWithValidatedWebsites();

  console.log("JSON Agencies:", agencies.length);
console.log("Mapped Agencies:", docs.length);

await Agency.bulkWrite(
  docs.map(doc => ({
    updateOne: {
      filter: {
        normalizedName: doc.normalizedName
      },
      update: {
        $set: doc
      },
      upsert: true
    }
  }))
);
  await refreshRankings();
  const enriched = await enrichGithubAgencies(100);
  return { seeded: true, count: agencies.length, enriched };
};
