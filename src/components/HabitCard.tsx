import { useState } from 'react';
import { Trash2, Edit2, Flame, Snowflake, ChevronDown, ChevronUp } from 'lucide-react';
import { useHabitStore, type Habit } from '../store/habitStore';
import { COLOR_MAP } from '../utils/colors';
import { HabitIconComponent } from './HabitIconComponent';
import { CheckInButton } from './CheckInButton';
import { StreakDisplay } from './StreakDisplay';
import { CalendarHeatmap } from './CalendarHeatmap';
import { getToday } from '../utils/gamification';

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
}

export function HabitCard({ habit, onEdit }: HabitCardProps) {
  const { deleteHabit, getStreakForHabit, toggleFreezeDay, theme } = useHabitStore();
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const streak = getStreakForHabit(habit.id);
  const color = COLOR_MAP[habit.color];
  const today = getToday();
  const isFrozenToday = habit.freezeDays.includes(today);

  function handleDelete() {
    if (confirmDelete) {
      deleteHabit(habit.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  }

  const cardBase = theme === 'dark'
    ? 'bg-slate-900 border border-slate-800 hover:border-slate-700'
    : 'bg-white border border-slate-200 hover:border-slate-300';

  return (
    <div className={`rounded-2xl transition-all duration-200 ${cardBase}`}>
      {/* Color accent bar */}
      <div className={`h-1 rounded-t-2xl ${color.bg}`} />

      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`w-10 h-10 rounded-xl ${color.bgLight} ${color.text} flex items-center justify-center flex-shrink-0`}>
            <HabitIconComponent name={habit.icon} size={20} />
          </div>

          {/* Name + meta */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold truncate ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
              {habit.name}
            </h3>
            {habit.description && (
              <p className={`text-xs truncate mt-0.5 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                {habit.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${color.bgLight} ${color.text}`}>
                {habit.frequency}
              </span>
              {streak > 0 && (
                <span className="flex items-center gap-0.5 text-[11px] text-amber-400 font-semibold">
                  <Flame size={11} />
                  {streak}d
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <CheckInButton habitId={habit.id} color={habit.color} />

            <button
              onClick={() => onEdit(habit)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-105 ${
                theme === 'dark'
                  ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Edit2 size={14} />
            </button>

            <button
              onClick={handleDelete}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-105 ${
                confirmDelete
                  ? 'bg-rose-500/20 text-rose-400'
                  : theme === 'dark'
                  ? 'text-slate-500 hover:text-rose-400 hover:bg-rose-500/10'
                  : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50'
              }`}
              title={confirmDelete ? 'Click again to confirm' : 'Delete habit'}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Streak + freeze row */}
        <div className="flex items-center justify-between mt-3">
          <StreakDisplay habitId={habit.id} color={habit.color} />

          <div className="flex items-center gap-2">
            {/* Freeze today */}
            <button
              onClick={() => toggleFreezeDay(habit.id, today)}
              title={isFrozenToday ? 'Unfreeze today' : "Freeze today (won't break streak)"}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                isFrozenToday
                  ? 'bg-sky-500/20 text-sky-400'
                  : theme === 'dark'
                  ? 'bg-slate-800 text-slate-500 hover:text-sky-400 hover:bg-sky-500/10'
                  : 'bg-slate-100 text-slate-400 hover:text-sky-500 hover:bg-sky-50'
              }`}
            >
              <Snowflake size={12} />
              {isFrozenToday ? 'Frozen' : 'Freeze'}
            </button>

            {/* Expand heatmap */}
            <button
              onClick={() => setExpanded((v) => !v)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                theme === 'dark'
                  ? 'bg-slate-800 text-slate-500 hover:text-slate-300'
                  : 'bg-slate-100 text-slate-400 hover:text-slate-600'
              }`}
            >
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              Heatmap
            </button>
          </div>
        </div>

        {/* Expandable heatmap */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-800/50">
            <CalendarHeatmap habitId={habit.id} color={habit.color} days={42} />
          </div>
        )}
      </div>
    </div>
  );
}
