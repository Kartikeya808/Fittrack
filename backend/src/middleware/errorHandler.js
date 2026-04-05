import mongoose from 'mongoose';
import { ZodError } from 'zod';

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ZodError) {
    const message = err.issues[0]?.message || 'Validation failed';
    return res.status(400).json({ message });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const firstMessage = Object.values(err.errors)[0]?.message || 'Validation failed';
    return res.status(400).json({ message: firstMessage });
  }

  if (err?.code === 11000) {
    return res.status(409).json({ message: 'A record with that value already exists' });
  }

  const status = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return res.status(status).json({ message });
}
