import { Router } from 'express';

import { createWorkout, listWorkouts } from '../controllers/workout.controller.js';

const router = Router();

router.get('/', listWorkouts);
router.post('/', createWorkout);

export default router;
