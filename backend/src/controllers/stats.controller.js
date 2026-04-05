import { z } from 'zod';

import { Workout } from '../models/Workout.js';
import {
  buildPeriodChart,
  getMonthRange,
  getTodayRange,
  getWeekRange,
  getYearRange,
} from '../utils/dateRanges.js';

const periodSchema = z.object({
  period: z.enum(['week', 'month', 'year']).optional().default('week'),
});

function buildSummary(workouts) {
  const totalTime = workouts.reduce((sum, workout) => sum + workout.duration, 0);
  const totalSessions = workouts.length;
  const totalCalories = workouts.reduce((sum, workout) => sum + (workout.calories || 0), 0);

  return {
    totalTime,
    totalSessions,
    avgDuration: totalSessions === 0 ? 0 : totalTime / totalSessions,
    totalCalories,
  };
}

function getRangeForPeriod(period, now = new Date()) {
  if (period === 'month') {
    return getMonthRange(now);
  }

  if (period === 'year') {
    return getYearRange(now);
  }

  return getWeekRange(now);
}

export async function getDashboardStats(req, res) {
  const userId = req.user._id;
  const todayRange = getTodayRange();
  const weekRange = getWeekRange();

  const [todayWorkouts, weekWorkouts, recentWorkouts] = await Promise.all([
    Workout.find({ user: userId, date: { $gte: todayRange.start, $lt: todayRange.end } })
      .sort({ date: -1, createdAt: -1 })
      .lean(),
    Workout.find({ user: userId, date: { $gte: weekRange.start, $lt: weekRange.end } }).lean(),
    Workout.find({ user: userId })
      .sort({ date: -1, createdAt: -1 })
      .select('_id type duration date intensity')
      .limit(5)
      .lean(),
  ]);

  const todayMinutes = todayWorkouts.reduce((sum, workout) => sum + workout.duration, 0);
  const weekMinutes = weekWorkouts.reduce((sum, workout) => sum + workout.duration, 0);
  const todaySchedule = todayWorkouts[0]
    ? {
        _id: todayWorkouts[0]._id,
        type: todayWorkouts[0].type,
        duration: todayWorkouts[0].duration,
        intensity: todayWorkouts[0].intensity,
        date: todayWorkouts[0].date,
      }
    : null;

  return res.json({
    todayMinutes,
    weekMinutes,
    todaySchedule,
    recentWorkouts,
  });
}

export async function getProgressStats(req, res) {
  const { period } = periodSchema.parse(req.query);
  const { start, end } = getRangeForPeriod(period);

  const workouts = await Workout.find({
    user: req.user._id,
    date: { $gte: start, $lt: end },
  })
    .sort({ date: 1, createdAt: 1 })
    .lean();

  return res.json({
    chart: buildPeriodChart(period, workouts),
    summary: buildSummary(workouts),
  });
}
