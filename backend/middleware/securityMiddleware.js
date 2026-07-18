const windows = new Map();

export const securityHeaders = (req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  });
  next();
};

// Lightweight in-process protection for the single Render web service. It has no
// external dependency and safely expires entries to avoid unbounded memory use.
export const rateLimit = ({ windowMs = 60_000, max = 180, key = (req) => req.ip } = {}) => (req, res, next) => {
  const now = Date.now(); const id = `${req.path}:${key(req)}`; const entry = windows.get(id);
  if (!entry || now >= entry.resetAt) { windows.set(id, { count: 1, resetAt: now + windowMs }); return next(); }
  entry.count += 1;
  if (entry.count > max) return res.status(429).json({ success: false, message: 'Too many requests. Please try again shortly.' });
  if (windows.size > 10_000) for (const [storedKey, stored] of windows) if (stored.resetAt < now) windows.delete(storedKey);
  next();
};
