import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  const cookieToken = req.headers.cookie?.split(';').map((part) => part.trim()).find((part) => part.startsWith('agencyhub_token='))?.slice('agencyhub_token='.length);
  const token = (req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.slice(7)) || cookieToken;
  if (!token) throw new AppError('Authentication is required.', 401);
  let payload;
  try { payload = jwt.verify(token, process.env.JWT_SECRET); } catch { throw new AppError('Your session has expired. Please sign in again.', 401); }
  req.user = await User.findById(payload.id).select('-password');
  if (!req.user || !req.user.isActive) throw new AppError('This account is unavailable.', 401);
  next();
});
export const optionalAuth = asyncHandler(async (req, res, next) => {
  const cookieToken = req.headers.cookie?.split(';').map((part) => part.trim()).find((part) => part.startsWith('agencyhub_token='))?.slice('agencyhub_token='.length);
  const token = (req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.slice(7)) || cookieToken;
  if (!token) return next();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');
    if (user?.isActive) req.user = user;
  } catch { /* Public discovery remains available when a stored session expires. */ }
  next();
});
export const adminOnly = (req, res, next) => req.user?.role === 'admin' ? next() : next(new AppError('Administrator access is required.', 403));
