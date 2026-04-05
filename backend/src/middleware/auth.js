import { User } from '../models/User.js';
import { verifyToken } from '../utils/jwt.js';

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const token = authHeader.slice(7).trim();

  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.sub).select('_id name email').lean();

    if (!user) {
      return res.status(401).json({ message: 'Invalid session' });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid session' });
  }
}
