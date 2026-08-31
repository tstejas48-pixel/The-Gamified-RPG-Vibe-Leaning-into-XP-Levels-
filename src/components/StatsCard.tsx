import { Flame, Trophy, Zap, ListChecks } from 'lucide-react';
import { useHabitStore } from '../store/habitStore';
import { calculateLevel, calculateStreak } from '../utils/gamification';

export function StatsCard() {
  const { habits, checkIns, totalXP, theme } = useHabitStore();

  const level = calculateLevel(totalXP);

  // Longest streak across all habits
  const longestStreak = habits.reduce((max, h) => {
    const dates = checkIns
      .filter((c) => c.habitId === h.id)
      .map((c) => c.date)
      .sort()
      .reverse();
    return Math.max(max, calculateStreak(dates, h.freezeDays));
  }, 0);

  const cardBase = theme === 'dark'
    ? 'bg-slate-900 border border-slate-800'
    : 'bg-white border border-slate-200';

  const stats = [
    {
      label: 'Habits',
      value: habits.length,
      icon: <ListChecks size={18} />,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
    },
    {
      label: 'Best Streak',
      value: `${longestStreak}d`,
      icon: <Flame size={18} />,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Total XP',
      value: totalXP,
      icon: <Zap size={18} />,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Level',
      value: level,
      icon: <Trophy size={18} />,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
    },
  ];

  return (
    <div className={`rounded-2xl p-4 ${cardBase}`}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-xl p-3 ${theme === 'dark' ? 'bg-slate-800/60' : 'bg-slate-50'}`}
          >
            <div className={`w-8 h-8 rounded-lg ${s.bg} ${s.color} flex items-center justify-center mb-2`}>
              {s.icon}
            </div>
            <p className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {s.value}
            </p>
            <p className={`text-xs font-medium mt-0.5 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
