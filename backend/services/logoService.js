export const domainForWebsite = (website) => {
  try {
    return new URL(website).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return undefined;
  }
};

// This is intentionally generated at ingestion time and stored on Agency.  The
// client only consumes the stored value, so card rendering never has to derive it.
export const logoForDomain = (domain) => {
  if (!domain) return undefined;
  const params = new URLSearchParams({ size: '256', format: 'png' });
  if (process.env.LOGO_DEV_TOKEN) params.set('token', process.env.LOGO_DEV_TOKEN);
  return `https://img.logo.dev/${encodeURIComponent(domain)}?${params.toString()}`;
};

export const logoForWebsite = (website) => logoForDomain(domainForWebsite(website));
