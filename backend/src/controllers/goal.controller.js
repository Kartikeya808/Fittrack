import mongoose from 'mongoose';
import { z } from 'zod';

import { Goal } from '../models/Goal.js';

const goalSchema = z.object({
  title: z.string().trim().min(1, 'Please fill in all required fields').max(120, 'Goal title is too long'),
  target: z.coerce.number().int().min(1, 'Target must be at least 1'),
  current: z.coerce.number().int().min(0, 'Current progress cannot be negative').default(0),
  unit: z.string().trim().min(1, 'Please fill in all required fields').max(60, 'Unit is too long'),
});

function ensureValidId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Goal not found');
    error.statusCode = 404;
    throw error;
  }
}

export async function listGoals(req, res) {
  const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
  return res.json(goals);
}

export async function createGoal(req, res) {
  const payload = goalSchema.parse(req.body);
  const goal = await Goal.create({ ...payload, user: req.user._id });
  return res.status(201).json(goal);
}

export async function updateGoal(req, res) {
  ensureValidId(req.params.id);
  const payload = goalSchema.parse(req.body);

  const goal = await Goal.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    payload,
    { new: true, runValidators: true }
  ).lean();

  if (!goal) {
    return res.status(404).json({ message: 'Goal not found' });
  }

  return res.json(goal);
}

export async function deleteGoal(req, res) {
  ensureValidId(req.params.id);

  const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id }).lean();

  if (!goal) {
    return res.status(404).json({ message: 'Goal not found' });
  }

  return res.json({ message: 'Goal deleted' });
}
