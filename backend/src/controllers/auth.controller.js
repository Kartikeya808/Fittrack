import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { User } from '../models/User.js';
import { signToken } from '../utils/jwt.js';

const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().trim().email('Enter a valid email address').transform((value) => value.toLowerCase()),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password is too long'),
});

const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address').transform((value) => value.toLowerCase()),
  password: z.string().min(1, 'Password is required'),
});

function serializeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
  };
}

export async function register(req, res) {
  const payload = registerSchema.parse(req.body);

  const existingUser = await User.findOne({ email: payload.email }).lean();
  if (existingUser) {
    return res.status(409).json({ message: 'An account with this email already exists' });
  }

  const passwordHash = await bcrypt.hash(payload.password, 12);
  const user = await User.create({
    name: payload.name,
    email: payload.email,
    passwordHash,
  });

  const responseUser = serializeUser(user);
  const token = signToken(user._id);

  return res.status(201).json({ token, user: responseUser });
}

export async function login(req, res) {
  const payload = loginSchema.parse(req.body);
  const user = await User.findOne({ email: payload.email }).select('+passwordHash');

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const passwordMatches = await bcrypt.compare(payload.password, user.passwordHash);

  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = signToken(user._id);

  return res.json({
    token,
    user: serializeUser(user),
  });
}

export async function getMe(req, res) {
  return res.json(req.user);
}
