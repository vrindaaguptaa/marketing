import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Review from '../models/Review.js';
import Bookmark from '../models/Bookmark.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const tokenFor = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt, updatedAt: user.updatedAt });
const cookieOptions = { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000, path: '/' };
const sendAuth = (res, user, status = 200) => { const token = tokenFor(user); return res.cookie('agencyhub_token', token, cookieOptions).status(status).json({ success: true, token, user: publicUser(user) }); };

export const signup = asyncHandler(async (req, res) => { const { name, email, password } = req.body; if (await User.exists({ email: email.toLowerCase() })) throw new AppError('An account with this email already exists.', 409); return sendAuth(res, await User.create({ name, email, password }), 201); });
export const login = asyncHandler(async (req, res) => { const { email, password } = req.body; const user = await User.findOne({ email: email.toLowerCase() }).select('+password'); if (!user || !(await user.comparePassword(password))) throw new AppError('Invalid email or password.', 401); if (!user.isActive) throw new AppError('This account is unavailable.', 403); return sendAuth(res, user); });
export const logout = (req, res) => res.clearCookie('agencyhub_token', { ...cookieOptions, maxAge: 0 }).json({ success: true });
export const me = asyncHandler(async (req, res) => res.json({ success: true, user: publicUser(req.user) }));
export const profile = asyncHandler(async (req, res) => { const [reviewsWritten, savedAgencies] = await Promise.all([Review.countDocuments({ user: req.user._id }), Bookmark.countDocuments({ user: req.user._id })]); res.json({ success: true, data: { ...publicUser(req.user), reviewsWritten, savedAgencies } }); });
export const updateProfile = asyncHandler(async (req, res) => { const user = await User.findByIdAndUpdate(req.user._id, { name: req.body.name.trim() }, { new: true, runValidators: true }); res.json({ success: true, user: publicUser(user) }); });
export const changePassword = asyncHandler(async (req, res) => { const user = await User.findById(req.user._id).select('+password'); if (!(await user.comparePassword(req.body.currentPassword))) throw new AppError('Your current password is incorrect.', 401); user.password = req.body.newPassword; await user.save(); return sendAuth(res, user); });
