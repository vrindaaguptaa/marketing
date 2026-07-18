import { domainForWebsite } from './logoService.js';

const timeoutFor = (ms) => AbortSignal.timeout(ms);

const canReach = async (url) => {
  try {
    // HEAD is cheap, while GET gives us a useful answer for hosts that reject HEAD.
    let response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: timeoutFor(5000) });
    if (response.status === 405 || response.status === 501) {
      response = await fetch(url, { method: 'GET', redirect: 'follow', signal: timeoutFor(5000) });
    }
    // A server responding with auth/forbidden is still an available official site.
    return response.status > 0 && response.status < 500;
  } catch {
    return false;
  }
};

export const websiteCandidates = (website) => {
  const domain = domainForWebsite(website);
  if (!domain) return [];
  return [`https://${domain}`, `https://www.${domain}`, `http://${domain}`];
};

export const validateWebsite = async (website) => {
  const domain = domainForWebsite(website);
  for (const candidate of websiteCandidates(website)) {
    if (await canReach(candidate)) {
      return { website: candidate, domain, websiteVerified: true };
    }
  }
  return { website: website || undefined, domain, websiteVerified: false };
};
