import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';

export const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
  if (!token) return next(new ApiError(401, 'Authentication required'));

  try {
    const payload = jwt.verify(token, config.jwt.secret);
    req.user = await User.findById(payload.sub).select('_id name email role');
    if (!req.user) return next(new ApiError(401, 'User no longer exists'));
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, 'Forbidden'));
  }
  next();
};

export const isOwnerOrAdmin = (getOwnerId) => async (req, res, next) => {
  try {
    const ownerId = await getOwnerId(req);
    if (!ownerId) return next(new ApiError(404, 'Resource not found'));
    const isOwner = ownerId.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return next(new ApiError(403, 'Forbidden'));
    }
    next();
  } catch (e) {
    next(e);
  }
};
