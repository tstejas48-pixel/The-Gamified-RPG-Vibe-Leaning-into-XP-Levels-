import { Flame } from 'lucide-react';
import { useHabitStore, type HabitColor } from '../store/habitStore';
import { COLOR_MAP } from '../utils/colors';

interface StreakDisplayProps {
  habitId: string;
  color: HabitColor;
  showLabel?: boolean;
}

export function StreakDisplay({ habitId, color, showLabel = true }: StreakDisplayProps) {
  const { getStreakForHabit, theme } = useHabitStore();
  const streak = getStreakForHabit(habitId);
  const c = COLOR_MAP[color];

  if (streak === 0) {
    return (
      <div className={`flex items-center gap-1 text-xs ${theme === 'dark' ? 'text-slate-600' : 'text-slate-300'}`}>
        <Flame size={13} />
        <span>No streak yet</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${c.bgLight}`}>
      <Flame size={13} className={streak >= 7 ? 'text-amber-400' : c.text} />
      <span className={`text-xs font-bold ${streak >= 7 ? 'text-amber-400' : c.text}`}>
        {streak} day{streak !== 1 ? 's' : ''}
      </span>
      {showLabel && (
        <span className={`text-[10px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
          streak
        </span>
      )}
    </div>
  );
}
