import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  calculateXP,
  calculateStreak,
  checkBadges,
  getToday,
} from '../utils/gamification';

// ─── Types ───────────────────────────────────────────────────────────────────

export type HabitColor =
  | 'emerald'
  | 'violet'
  | 'amber'
  | 'rose'
  | 'sky'
  | 'orange'
  | 'pink'
  | 'teal';

export type HabitIcon =
  | 'Dumbbell'
  | 'BookOpen'
  | 'Droplets'
  | 'Moon'
  | 'Apple'
  | 'Brain'
  | 'Heart'
  | 'Music'
  | 'Pencil'
  | 'Run'
  | 'Coffee'
  | 'Zap';

export type HabitFrequency = 'daily' | 'weekly' | 'custom';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: HabitFrequency;
  customDays?: number[]; // 0=Sun … 6=Sat
  color: HabitColor;
  icon: HabitIcon;
  createdAt: string; // ISO date string
  freezeDays: string[]; // ISO date strings that are "frozen"
  archivedAt?: string;
}

export interface CheckIn {
  habitId: string;
  date: string; // YYYY-MM-DD
  xpEarned: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string; // ISO date string — undefined = locked
}

export interface ToastMessage {
  id: string;
  message: string;
  xp?: number;
}

export interface HabitStore {
  // State
  habits: Habit[];
  checkIns: CheckIn[];
  badges: Badge[];
  totalXP: number;
  theme: 'dark' | 'light';
  toasts: ToastMessage[];

  // Toast actions
  addToast: (msg: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Derived helpers
  getStreakForHabit: (habitId: string) => number;
  isCheckedIn: (habitId: string, date?: string) => boolean;

  // Habit CRUD
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'freezeDays'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;

  // Check-in
  toggleCheckIn: (habitId: string) => void;
  toggleFreezeDay: (habitId: string, date: string) => void;

  // Theme
  toggleTheme: () => void;

  // Internal
  _recalculate: () => void;
}

// ─── Badge Definitions ────────────────────────────────────────────────────────

export const BADGE_DEFS: Omit<Badge, 'unlockedAt'>[] = [
  { id: 'first_habit',    name: 'Forge Begins',   description: 'Created your first habit',        icon: '⚒️' },
  { id: 'first_checkin',  name: 'Day One',         description: 'Completed your first check-in',   icon: '✅' },
  { id: 'streak_3',       name: 'On a Roll',       description: 'Reached a 3-day streak',           icon: '🔥' },
  { id: 'streak_7',       name: 'Week Warrior',    description: 'Reached a 7-day streak',           icon: '⚡' },
  { id: 'streak_14',      name: 'Fortnight Force', description: 'Reached a 14-day streak',          icon: '💪' },
  { id: 'streak_30',      name: 'Iron Will',       description: 'Reached a 30-day streak',          icon: '🏆' },
  { id: 'xp_100',         name: 'Century',         description: 'Earned 100 XP',                    icon: '💯' },
  { id: 'xp_500',         name: 'XP Machine',      description: 'Earned 500 XP',                    icon: '🚀' },
  { id: 'xp_1000',        name: 'Elite Forger',    description: 'Earned 1000 XP',                   icon: '👑' },
  { id: 'habits_3',       name: 'Habit Stack',     description: 'Tracking 3 or more habits',        icon: '📚' },
  { id: 'habits_5',       name: 'Power Stacker',   description: 'Tracking 5 or more habits',        icon: '🌟' },
  { id: 'all_daily',      name: 'Perfect Day',     description: 'Checked in all habits in one day', icon: '🎯' },
];

// ─── Store ───────────────────────────────────────────────────────────────────

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],
      checkIns: [],
      badges: BADGE_DEFS.map((b) => ({ ...b })),
      totalXP: 0,
      theme: 'dark',
      toasts: [],

      // ── Toast actions ───────────────────────────────────────────────────────
      addToast: (msg) => {
        const id = crypto.randomUUID();
        set((s) => ({ toasts: [...s.toasts, { ...msg, id }] }));
      },
      removeToast: (id) => {
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
      },

      // ── Derived helpers ─────────────────────────────────────────────────────
      getStreakForHabit: (habitId) => {
        const { checkIns, habits } = get();
        const habit = habits.find((h) => h.id === habitId);
        if (!habit) return 0;
        const dates = checkIns
          .filter((c) => c.habitId === habitId)
          .map((c) => c.date)
          .sort()
          .reverse();
        return calculateStreak(dates, habit.freezeDays);
      },

      isCheckedIn: (habitId, date) => {
        const d = date ?? getToday();
        return get().checkIns.some((c) => c.habitId === habitId && c.date === d);
      },

      // ── Habit CRUD ──────────────────────────────────────────────────────────
      addHabit: (habit) => {
        const newHabit: Habit = {
          ...habit,
          id: crypto.randomUUID(),
          createdAt: getToday(),
          freezeDays: [],
        };
        set((s) => ({ habits: [...s.habits, newHabit] }));
        get()._recalculate();
      },

      updateHabit: (id, updates) => {
        set((s) => ({
          habits: s.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        }));
      },

      deleteHabit: (id) => {
        set((s) => ({
          habits: s.habits.filter((h) => h.id !== id),
          checkIns: s.checkIns.filter((c) => c.habitId !== id),
        }));
        get()._recalculate();
      },

      // ── Check-in ────────────────────────────────────────────────────────────
      toggleCheckIn: (habitId) => {
        const today = getToday();
        const { isCheckedIn, checkIns, getStreakForHabit } = get();

        if (isCheckedIn(habitId, today)) {
          // Un-check: remove the check-in and subtract XP
          const removed = checkIns.find(
            (c) => c.habitId === habitId && c.date === today
          );
          set((s) => ({
            checkIns: s.checkIns.filter(
              (c) => !(c.habitId === habitId && c.date === today)
            ),
            totalXP: Math.max(0, s.totalXP - (removed?.xpEarned ?? 0)),
          }));
        } else {
          // Check-in: calculate XP with current streak
          const currentStreak = getStreakForHabit(habitId);
          const xp = calculateXP(currentStreak + 1);
          const habit = get().habits.find((h) => h.id === habitId);
          set((s) => ({
            checkIns: [...s.checkIns, { habitId, date: today, xpEarned: xp }],
            totalXP: s.totalXP + xp,
          }));
          // Show toast
          get().addToast({
            message: `${habit?.name ?? 'Habit'} checked in!`,
            xp,
          });
        }
        get()._recalculate();
      },

      toggleFreezeDay: (habitId, date) => {
        set((s) => ({
          habits: s.habits.map((h) => {
            if (h.id !== habitId) return h;
            const already = h.freezeDays.includes(date);
            return {
              ...h,
              freezeDays: already
                ? h.freezeDays.filter((d) => d !== date)
                : [...h.freezeDays, date],
            };
          }),
        }));
      },

      // ── Theme ───────────────────────────────────────────────────────────────
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: next });
        // Sync to <html> class for Tailwind dark mode
        document.documentElement.classList.toggle('dark', next === 'dark');
      },

      // ── Internal recalculation ──────────────────────────────────────────────
      _recalculate: () => {
        const { habits, checkIns, badges } = get();
        const totalXP = checkIns.reduce((sum, c) => sum + c.xpEarned, 0);

        // Compute max streak across all habits
        const maxStreak = habits.reduce((max, h) => {
          const dates = checkIns
            .filter((c) => c.habitId === h.id)
            .map((c) => c.date)
            .sort()
            .reverse();
          return Math.max(max, calculateStreak(dates, h.freezeDays));
        }, 0);

        // Badge unlock logic
        const updatedBadges = checkBadges(badges, {
          habits,
          checkIns,
          totalXP,
          maxStreak,
        });

        set({ totalXP, badges: updatedBadges });
      },
    }),
    {
      name: 'habitforge-storage',
      // Don't persist toasts — they're ephemeral
      partialize: (state) => ({
        habits: state.habits,
        checkIns: state.checkIns,
        badges: state.badges,
        totalXP: state.totalXP,
        theme: state.theme,
      }),
      onRehydrateStorage: () => (state) => {
        // Sync theme class after rehydration
        if (state) {
          document.documentElement.classList.toggle(
            'dark',
            state.theme === 'dark'
          );
        }
      },
    }
  )
);
