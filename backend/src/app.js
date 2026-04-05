import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requireAuth } from './middleware/auth.js';
import { notFound } from './middleware/notFound.js';
import authRoutes from './routes/auth.routes.js';
import goalRoutes from './routes/goal.routes.js';
import statsRoutes from './routes/stats.routes.js';
import workoutRoutes from './routes/workout.routes.js';

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/workouts', requireAuth, workoutRoutes);
app.use('/api/goals', requireAuth, goalRoutes);
app.use('/api/stats', requireAuth, statsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
