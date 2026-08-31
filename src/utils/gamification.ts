import type { Badge, CheckIn, Habit } from '../store/habitStore';

// ─── Date Helpers ──────────────────────────────────────────────────────────────

/** Returns today's date as YYYY-MM-DD */
export function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Returns date N days ago as YYYY-MM-DD */
export function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

/** Returns all dates between start and end (inclusive) as YYYY-MM-DD[] */
export function dateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

/** Returns the YYYY-MM-DD for each day of the current week (Mon–Sun) */
export function getCurrentWeekDates(): string[] {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

/** Format YYYY-MM-DD to a readable short label e.g. "Mon 1" */
export function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
}

/** Format YYYY-MM-DD to "Jan 1" */
export function formatMonthDay(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── XP & Level ───────────────────────────────────────────────────────────────

/**
 * XP per check-in: base 10 + 5 per streak tier.
 * streak=1 → 10 XP, streak=3 → 20 XP, streak=7 → 40 XP, etc.
 */
export function calculateXP(streak: number): number {
  const bonus = Math.floor((streak - 1) / 2) * 5;
  return 10 + bonus;
}

/** Level = floor(sqrt(totalXP / 50)) + 1 — capped for sanity */
export function calculateLevel(totalXP: number): number {
  return Math.floor(Math.sqrt(totalXP / 50)) + 1;
}

/** XP required to reach the NEXT level from current level */
export function xpForNextLevel(level: number): number {
  return (level * level) * 50;
}

/** XP required to reach the CURRENT level */
export function xpForCurrentLevel(level: number): number {
  return ((level - 1) * (level - 1)) * 50;
}

/** Progress (0–1) toward next level */
export function levelProgress(totalXP: number): number {
  const level = calculateLevel(totalXP);
  const current = xpForCurrentLevel(level);
  const next = xpForNextLevel(level);
  if (next === current) return 1;
  return Math.min(1, (totalXP - current) / (next - current));
}

// ─── Streak ───────────────────────────────────────────────────────────────────

/**
 * Count consecutive check-in days going backwards from today.
 * freezeDays are treated as "skipped" but don't break the streak.
 */
export function calculateStreak(
  checkedDates: string[], // sorted desc
  freezeDays: string[] = []
): number {
  if (checkedDates.length === 0) return 0;

  const checkedSet = new Set(checkedDates);
  const frozenSet = new Set(freezeDays);
  const today = getToday();

  let streak = 0;
  let cursor = new Date(today + 'T00:00:00');

  // Allow today to be not yet checked (streak still valid from yesterday)
  const todayChecked = checkedSet.has(today);
  if (!todayChecked && !frozenSet.has(today)) {
    // Check if yesterday was checked — if not, streak is 0
    const yesterday = new Date(cursor);
    yesterday.setDate(cursor.getDate() - 1);
    const yd = yesterday.toISOString().slice(0, 10);
    if (!checkedSet.has(yd) && !frozenSet.has(yd)) {
      return 0;
    }
    cursor = yesterday;
  }

  // Walk backwards
  for (let i = 0; i < 365; i++) {
    const d = cursor.toISOString().slice(0, 10);
    if (checkedSet.has(d)) {
      streak++;
    } else if (frozenSet.has(d)) {
      // Frozen day: don't increment streak, don't break it
    } else {
      break;
    }
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

// ─── Badge Logic ───────────────────────────────────────────────────────────────

interface BadgeContext {
  habits: Habit[];
  checkIns: CheckIn[];
  totalXP: number;
  maxStreak: number;
}

export function checkBadges(badges: Badge[], ctx: BadgeContext): Badge[] {
  const today = getToday();
  const totalHabits = ctx.habits.length;
  const totalCheckIns = ctx.checkIns.length;

  // Check if all habits were checked today
  const todayCheckIns = new Set(
    ctx.checkIns.filter((c) => c.date === today).map((c) => c.habitId)
  );
  const allCheckedToday =
    totalHabits > 0 && ctx.habits.every((h) => todayCheckIns.has(h.id));

  const conditions: Record<string, boolean> = {
    first_habit:   totalHabits >= 1,
    first_checkin: totalCheckIns >= 1,
    streak_3:      ctx.maxStreak >= 3,
    streak_7:      ctx.maxStreak >= 7,
    streak_14:     ctx.maxStreak >= 14,
    streak_30:     ctx.maxStreak >= 30,
    xp_100:        ctx.totalXP >= 100,
    xp_500:        ctx.totalXP >= 500,
    xp_1000:       ctx.totalXP >= 1000,
    habits_3:      totalHabits >= 3,
    habits_5:      totalHabits >= 5,
    all_daily:     allCheckedToday,
  };

  return badges.map((badge) => {
    if (badge.unlockedAt) return badge; // already unlocked
    if (conditions[badge.id]) {
      return { ...badge, unlockedAt: today };
    }
    return badge;
  });
}

// ─── Weekly Stats ─────────────────────────────────────────────────────────────

export interface WeeklyHabitStat {
  habitId: string;
  name: string;
  color: string;
  checked: number;
  total: number;
  pct: number;
}

export function getWeeklyStats(
  habits: Habit[],
  checkIns: CheckIn[]
): WeeklyHabitStat[] {
  const weekDates = getCurrentWeekDates();
  return habits.map((h) => {
    const checked = weekDates.filter((d) =>
      checkIns.some((c) => c.habitId === h.id && c.date === d)
    ).length;
    return {
      habitId: h.id,
      name: h.name,
      color: h.color,
      checked,
      total: weekDates.length,
      pct: Math.round((checked / weekDates.length) * 100),
    };
  });
}

// ─── Heatmap Data ────────────────────────────────────────────────────────────

export interface HeatmapCell {
  date: string;
  count: number; // number of habits checked on this day
  total: number; // total active habits on this day
  intensity: number; // 0–4
}

export function getHeatmapData(
  habits: Habit[],
  checkIns: CheckIn[],
  days = 63
): HeatmapCell[] {
  const cells: HeatmapCell[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const date = d.toISOString().slice(0, 10);

    // Only count habits that existed on this date
    const activeHabits = habits.filter((h) => h.createdAt <= date);
    const count = checkIns.filter(
      (c) => c.date === date && activeHabits.some((h) => h.id === c.habitId)
    ).length;
    const total = activeHabits.length;
    const ratio = total > 0 ? count / total : 0;
    const intensity = total === 0 ? 0 : Math.ceil(ratio * 4);

    cells.push({ date, count, total, intensity });
  }
  return cells;
}
