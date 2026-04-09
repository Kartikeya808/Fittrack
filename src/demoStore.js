const USER_KEY = 'fittrack_demo_user';
const WORKOUTS_KEY = 'fittrack_demo_workouts';
const GOALS_KEY = 'fittrack_demo_goals';

const demoUser = {
  _id: 'demo-user',
  name: 'Alex Carter',
  email: 'alex.carter@fittrack.demo',
};

function isoDaysFromToday(offset, hour = 7, minute = 0) {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  date.setDate(date.getDate() + offset);
  return date.toISOString();
}

function createInitialWorkouts() {
  return [
    {
      _id: 'demo-workout-1',
      type: 'Strength',
      duration: 52,
      intensity: 'High',
      calories: 420,
      date: isoDaysFromToday(0, 18, 0),
      notes: 'Upper body push session',
    },
    {
      _id: 'demo-workout-2',
      type: 'Walking/Running',
      duration: 34,
      intensity: 'Med',
      calories: 260,
      date: isoDaysFromToday(-1, 6, 45),
      notes: 'Interval run around the park',
    },
    {
      _id: 'demo-workout-3',
      type: 'Yoga/Stretching',
      duration: 28,
      intensity: 'Low',
      calories: 110,
      date: isoDaysFromToday(-2, 20, 0),
      notes: 'Mobility and recovery flow',
    },
    {
      _id: 'demo-workout-4',
      type: 'Cardio',
      duration: 40,
      intensity: 'High',
      calories: 360,
      date: isoDaysFromToday(-4, 7, 30),
      notes: 'Bike intervals',
    },
    {
      _id: 'demo-workout-5',
      type: 'Sports',
      duration: 65,
      intensity: 'Med',
      calories: 500,
      date: isoDaysFromToday(-6, 17, 30),
      notes: 'Weekend football match',
    },
  ];
}

function createInitialGoals() {
  return [
    { _id: 'demo-goal-1', title: 'Weekly Exercise', target: 240, current: 186, unit: 'min/week' },
    { _id: 'demo-goal-2', title: 'Strength Sessions', target: 3, current: 2, unit: 'sessions/week' },
    { _id: 'demo-goal-3', title: 'Daily Steps', target: 10000, current: 7600, unit: 'steps/day' },
  ];
}

function readStorage(key, createValue) {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    localStorage.removeItem(key);
  }

  const value = createValue();
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function sortByNewest(items) {
  return [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function isSameDay(first, second) {
  return first.getFullYear() === second.getFullYear()
    && first.getMonth() === second.getMonth()
    && first.getDate() === second.getDate();
}

function getStartOfDay(date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function getSummary(workouts) {
  const totalTime = workouts.reduce((sum, workout) => sum + workout.duration, 0);
  const totalSessions = workouts.length;
  const avgDuration = totalSessions ? totalTime / totalSessions : 0;
  const totalCalories = workouts.reduce((sum, workout) => sum + (workout.calories || 0), 0);

  return {
    totalTime,
    totalSessions,
    avgDuration,
    totalCalories,
  };
}

export function initializeDemoData() {
  writeStorage(USER_KEY, demoUser);
  readStorage(WORKOUTS_KEY, createInitialWorkouts);
  readStorage(GOALS_KEY, createInitialGoals);
}

export function getDemoUser() {
  return demoUser;
}

export function getDemoWorkouts() {
  return sortByNewest(readStorage(WORKOUTS_KEY, createInitialWorkouts));
}

export function saveDemoWorkout(workout) {
  const workouts = getDemoWorkouts();
  const nextWorkout = {
    _id: `demo-workout-${Date.now()}`,
    ...workout,
  };

  writeStorage(WORKOUTS_KEY, [nextWorkout, ...workouts]);
  return nextWorkout;
}

export function getDemoGoals() {
  return readStorage(GOALS_KEY, createInitialGoals);
}

export function createDemoGoal(goal) {
  const goals = getDemoGoals();
  const nextGoal = { _id: `demo-goal-${Date.now()}`, ...goal };
  writeStorage(GOALS_KEY, [nextGoal, ...goals]);
  return nextGoal;
}

export function updateDemoGoal(goalId, updates) {
  const goals = getDemoGoals().map((goal) => (goal._id === goalId ? { ...goal, ...updates } : goal));
  writeStorage(GOALS_KEY, goals);
}

export function deleteDemoGoal(goalId) {
  const goals = getDemoGoals().filter((goal) => goal._id !== goalId);
  writeStorage(GOALS_KEY, goals);
}

export function getDemoDashboard() {
  const workouts = getDemoWorkouts();
  const today = new Date();
  const weekStart = getStartOfDay(today);
  weekStart.setDate(weekStart.getDate() - 6);

  const todayWorkouts = workouts.filter((workout) => isSameDay(new Date(workout.date), today));
  const weekWorkouts = workouts.filter((workout) => new Date(workout.date) >= weekStart);

  return {
    todayMinutes: todayWorkouts.reduce((sum, workout) => sum + workout.duration, 0),
    weekMinutes: weekWorkouts.reduce((sum, workout) => sum + workout.duration, 0),
    todaySchedule: todayWorkouts[0] || null,
    recentWorkouts: workouts.slice(0, 4),
  };
}

export function getDemoProgress(period) {
  const workouts = getDemoWorkouts();
  const now = new Date();

  if (period === 'week') {
    const labels = [];
    const chart = [];

    for (let index = 6; index >= 0; index -= 1) {
      const day = new Date(now);
      day.setHours(0, 0, 0, 0);
      day.setDate(day.getDate() - index);
      labels.push(day);
    }

    for (const day of labels) {
      const minutes = workouts
        .filter((workout) => isSameDay(new Date(workout.date), day))
        .reduce((sum, workout) => sum + workout.duration, 0);

      chart.push({
        label: day.toLocaleDateString('en-US', { weekday: 'short' }),
        minutes,
      });
    }

    const rangeStart = getStartOfDay(labels[0]);
    const filtered = workouts.filter((workout) => new Date(workout.date) >= rangeStart);
    return { chart, summary: getSummary(filtered) };
  }

  if (period === 'month') {
    const chart = [];

    for (let index = 3; index >= 0; index -= 1) {
      const rangeEnd = new Date(now);
      rangeEnd.setHours(23, 59, 59, 999);
      rangeEnd.setDate(rangeEnd.getDate() - (index * 7));

      const rangeStart = getStartOfDay(rangeEnd);
      rangeStart.setDate(rangeStart.getDate() - 6);

      const filtered = workouts.filter((workout) => {
        const workoutDate = new Date(workout.date);
        return workoutDate >= rangeStart && workoutDate <= rangeEnd;
      });

      chart.push({
        label: `W${4 - index}`,
        minutes: filtered.reduce((sum, workout) => sum + workout.duration, 0),
      });
    }

    const monthStart = getStartOfDay(now);
    monthStart.setDate(monthStart.getDate() - 27);
    const filtered = workouts.filter((workout) => new Date(workout.date) >= monthStart);
    return { chart, summary: getSummary(filtered) };
  }

  const chart = [];
  for (let index = 11; index >= 0; index -= 1) {
    const month = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);

    const filtered = workouts.filter((workout) => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= month && workoutDate < nextMonth;
    });

    chart.push({
      label: month.toLocaleDateString('en-US', { month: 'short' }),
      minutes: filtered.reduce((sum, workout) => sum + workout.duration, 0),
    });
  }

  const yearStart = new Date(now.getFullYear(), 0, 1);
  const filtered = workouts.filter((workout) => new Date(workout.date) >= yearStart);
  return { chart, summary: getSummary(filtered) };
}
