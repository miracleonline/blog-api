import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import catchAsync from '../utils/catchAsync.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';

const signToken = (user) =>
  jwt.sign({ sub: user._id, role: user.role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

export const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, 'Email already in use');

  const user = await User.create({ name, email, password });
  const token = signToken(user);
  res.status(201).json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid credentials');

  const ok = await user.comparePassword(password);
  if (!ok) throw new ApiError(401, 'Invalid credentials');

  const token = signToken(user);
  res.json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

export const me = catchAsync(async (req, res) => {
  res.json({ success: true, user: req.user });
});
