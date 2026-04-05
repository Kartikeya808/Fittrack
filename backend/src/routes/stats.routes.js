import { Router } from 'express';

import { getDashboardStats, getProgressStats } from '../controllers/stats.controller.js';

const router = Router();

router.get('/dashboard', getDashboardStats);
router.get('/progress', getProgressStats);

export default router;
