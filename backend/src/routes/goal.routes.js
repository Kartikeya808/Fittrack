import { Router } from 'express';

import { createGoal, deleteGoal, listGoals, updateGoal } from '../controllers/goal.controller.js';

const router = Router();

router.get('/', listGoals);
router.post('/', createGoal);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

export default router;
