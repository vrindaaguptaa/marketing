// The production seed is a curated, static export in ../data/agencies.json.
// It was built from a public company-directory export and intentionally does
// not generate company names, domains, locations, or social profiles.
// Keep this guard so a synthetic generator cannot overwrite verified records.
console.error('The agency seed is curated static data. Do not regenerate it from name templates.');
process.exitCode = 1;
