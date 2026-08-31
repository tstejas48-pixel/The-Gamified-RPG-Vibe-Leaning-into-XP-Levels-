import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useHabitStore, type Habit } from '../store/habitStore';
import { HabitCard } from '../components/HabitCard';
import { HabitForm } from '../components/HabitForm';

export function HabitsView() {
  const { habits, theme } = useHabitStore();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            All Habits
          </h1>
          <p className={`text-sm mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            {habits.length} habit{habits.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500 text-white font-semibold text-sm
            hover:bg-violet-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-violet-500/30"
        >
          <Plus size={16} />
          New Habit
        </button>
      </div>

      {habits.length === 0 ? (
        <div className={`rounded-2xl p-12 flex flex-col items-center text-center ${cardBase}`}>
          <div className="text-5xl mb-4">📋</div>
          <h2 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
            No Habits Yet
          </h2>
          <p className={`text-sm mb-5 max-w-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
            Add your first habit to start tracking your progress.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 rounded-xl bg-violet-500 text-white font-semibold text-sm hover:bg-violet-600 transition-all shadow-md"
          >
            + Create Habit
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} onEdit={handleEdit} />
          ))}
        </div>
      )}

      {showForm && (
        <HabitForm onClose={handleCloseForm} editHabit={editingHabit} />
      )}
    </div>
  );
}
