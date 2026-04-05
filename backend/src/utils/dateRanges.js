const DAY_MS = 24 * 60 * 60 * 1000;

function startOfUtcDay(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addUtcDays(date, days) {
  return new Date(date.getTime() + days * DAY_MS);
}

export function getTodayRange(now = new Date()) {
  const start = startOfUtcDay(now);
  return { start, end: addUtcDays(start, 1) };
}

export function getWeekRange(now = new Date()) {
  const todayStart = startOfUtcDay(now);
  const day = todayStart.getUTCDay();
  const offsetToMonday = day === 0 ? -6 : 1 - day;
  const start = addUtcDays(todayStart, offsetToMonday);
  return { start, end: addUtcDays(start, 7) };
}

export function getMonthRange(now = new Date()) {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  return { start, end };
}

export function getYearRange(now = new Date()) {
  const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const end = new Date(Date.UTC(now.getUTCFullYear() + 1, 0, 1));
  return { start, end };
}

export function buildPeriodChart(period, workouts, now = new Date()) {
  if (period === 'week') {
    return buildWeekChart(workouts, now);
  }

  if (period === 'month') {
    return buildMonthChart(workouts, now);
  }

  return buildYearChart(workouts, now);
}

function buildWeekChart(workouts, now) {
  const { start } = getWeekRange(now);
  const chart = Array.from({ length: 7 }, (_, index) => {
    const date = addUtcDays(start, index);
    return {
      label: date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
      minutes: 0,
    };
  });

  for (const workout of workouts) {
    const key = Math.floor((startOfUtcDay(new Date(workout.date)).getTime() - start.getTime()) / DAY_MS);
    if (key >= 0 && key < 7) {
      chart[key].minutes += workout.duration;
    }
  }

  return chart;
}

function buildMonthChart(workouts, now) {
  const daysInMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)).getUTCDate();
  const chart = Array.from({ length: daysInMonth }, (_, index) => ({
    label: String(index + 1),
    minutes: 0,
  }));

  for (const workout of workouts) {
    const dayIndex = new Date(workout.date).getUTCDate() - 1;
    if (dayIndex >= 0 && dayIndex < chart.length) {
      chart[dayIndex].minutes += workout.duration;
    }
  }

  return chart;
}

function buildYearChart(workouts) {
  const chart = Array.from({ length: 12 }, (_, index) => ({
    label: new Date(Date.UTC(2024, index, 1)).toLocaleDateString('en-US', {
      month: 'short',
      timeZone: 'UTC',
    }),
    minutes: 0,
  }));

  for (const workout of workouts) {
    const monthIndex = new Date(workout.date).getUTCMonth();
    chart[monthIndex].minutes += workout.duration;
  }

  return chart;
}
