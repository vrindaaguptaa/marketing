import axios from 'axios';

const githubHeaders = () => ({ Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) });
const candidateFromWebsite = (website) => {
  try { return new URL(website).hostname.replace(/^www\./, '').split('.')[0]; } catch { return ''; }
};

export const getGithubOrganization = async (website) => {
  const organization = candidateFromWebsite(website);
  if (!organization) return null;
  try {
    const { data: org } = await axios.get(`https://api.github.com/orgs/${encodeURIComponent(organization)}`, { headers: githubHeaders(), timeout: 15000 });
    const { data: repos } = await axios.get(`https://api.github.com/orgs/${encodeURIComponent(organization)}/repos`, { headers: githubHeaders(), params: { per_page: 30, sort: 'updated' }, timeout: 15000 });
    return { login: org.login, publicRepos: org.public_repos || 0, followers: org.followers || 0, createdAt: org.created_at, updatedAt: repos[0]?.updated_at || org.updated_at, activity: repos.reduce((total, repo) => total + (repo.stargazers_count || 0) + (repo.forks_count || 0), 0) };
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw error;
  }
};
