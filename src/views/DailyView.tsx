import { useState } from 'react';
import { Plus, PartyPopper, Calendar } from 'lucide-react';
import { useHabitStore } from '../store/habitStore';
import { HabitCard } from '../components/HabitCard';
import { HabitForm } from '../components/HabitForm';
import { StatsCard } from '../components/StatsCard';
import { XPProgress } from '../components/XPProgress';
import type { Habit } from '../store/habitStore';
import { getToday } from '../utils/gamification';

export function DailyView() {
  const { habits, checkIns, theme } = useHabitStore();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();

  const today = getToday();
  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Count how many are done today
  const doneToday = habits.filter((h) =>
    checkIns.some((c) => c.habitId === h.id && c.date === today)
  ).length;
  const allDone = habits.length > 0 && doneToday === habits.length;

  function handleEdit(habit: Habit) {
    setEditingHabit(habit);
    setShowForm(true);
  }

  function handleCloseForm() {
    setShowForm(false);
    setEditingHabit(undefined);
  }

  const cardBase = theme === 'dark'
    ? 'bg-slate-900 border border-slate-800'
    : 'bg-white border border-slate-200';

  return (
    <div className="space-y-5">
      {/* Date header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className={theme === 'dark' ? 'text-slate-500' : 'text-slate-400'} />
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {todayLabel}
            </span>
          </div>
          <h1 className={`text-2xl font-black mt-0.5 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Today's Habits
          </h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500 text-white font-semibold text-sm
            hover:bg-violet-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-violet-500/30"
        >
          <Plus size={16} />
          <span className="hidden sm:block">New Habit</span>
        </button>
      </div>

      {/* Stats */}
      <StatsCard />

      {/* XP Progress */}
      <XPProgress />

      {/* All done banner */}
      {allDone && (
        <div className="rounded-2xl p-4 bg-gradient-to-r from-emerald-500/20 to-violet-500/20 border border-emerald-500/30 flex items-center gap-3">
          <PartyPopper className="text-emerald-400 flex-shrink-0" size={24} />
          <div>
            <p className="font-bold text-emerald-400">Perfect Day! 🎉</p>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              All {habits.length} habit{habits.length !== 1 ? 's' : ''} checked off. You're on fire!
            </p>
          </div>
        </div>
      )}

      {/* Progress indicator */}
      {habits.length > 0 && (
        <div className={`rounded-2xl p-4 ${cardBase}`}>
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Daily Progress
            </span>
            <span className={`text-sm font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
              {doneToday} / {habits.length}
            </span>
          </div>
          <div className={`h-2.5 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${habits.length > 0 ? (doneToday / habits.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Habit list */}
      {habits.length === 0 ? (
        <div className={`rounded-2xl p-10 flex flex-col items-center text-center ${cardBase}`}>
          <div className="text-5xl mb-4">⚒️</div>
          <h2 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
            Start Forging Habits
          </h2>
          <p className={`text-sm mb-5 max-w-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
            Create your first habit to start building streaks, earning XP, and unlocking badges.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 rounded-xl bg-violet-500 text-white font-semibold text-sm
              hover:bg-violet-600 hover:scale-[1.02] transition-all shadow-md"
          >
            + Create First Habit
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} onEdit={handleEdit} />
          ))}
        </div>
      )}

      {/* Habit Form Modal */}
      {showForm && (
        <HabitForm onClose={handleCloseForm} editHabit={editingHabit} />
      )}
    </div>
  );
}
