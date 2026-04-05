import { z } from 'zod';

import { Workout, WORKOUT_INTENSITIES, WORKOUT_TYPES } from '../models/Workout.js';

const dateStringSchema = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: 'Enter a valid workout date',
});

const listWorkoutsSchema = z.object({
  type: z.enum(WORKOUT_TYPES).optional(),
  search: z.string().trim().max(100, 'Search term is too long').optional(),
});

const workoutSchema = z.object({
  type: z.enum(WORKOUT_TYPES, { error: 'Please select a valid workout type' }),
  duration: z.coerce.number().int().min(1, 'Please enter a valid duration'),
  intensity: z.enum(WORKOUT_INTENSITIES).default('Med'),
  date: dateStringSchema,
  calories: z.union([z.coerce.number().int().min(0), z.null()]).optional().default(null),
  notes: z.string().trim().max(1000, 'Notes are too long').optional().default(''),
});

export async function listWorkouts(req, res) {
  const query = listWorkoutsSchema.parse(req.query);
  const filter = { user: req.user._id };

  if (query.type) {
    filter.type = query.type;
  }

  if (query.search) {
    const regex = new RegExp(query.search, 'i');
    filter.$or = [{ type: regex }, { notes: regex }];
  }

  const workouts = await Workout.find(filter).sort({ date: -1, createdAt: -1 }).lean();
  return res.json(workouts);
}

export async function createWorkout(req, res) {
  const payload = workoutSchema.parse(req.body);

  const workout = await Workout.create({
    user: req.user._id,
    type: payload.type,
    duration: payload.duration,
    intensity: payload.intensity,
    date: new Date(payload.date),
    calories: payload.calories,
    notes: payload.notes,
  });

  return res.status(201).json(workout);
}
