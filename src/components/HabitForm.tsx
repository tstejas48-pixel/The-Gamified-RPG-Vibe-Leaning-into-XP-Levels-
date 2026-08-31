import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useHabitStore, type Habit, type HabitColor, type HabitIcon } from '../store/habitStore';
import { COLORS, COLOR_MAP } from '../utils/colors';
import { HabitIconComponent, ICONS } from './HabitIconComponent';

interface HabitFormProps {
  onClose: () => void;
  editHabit?: Habit;
}

export function HabitForm({ onClose, editHabit }: HabitFormProps) {
  const { addHabit, updateHabit, theme } = useHabitStore();

  const [name, setName] = useState(editHabit?.name ?? '');
  const [description, setDescription] = useState(editHabit?.description ?? '');
  const [color, setColor] = useState<HabitColor>(editHabit?.color ?? 'violet');
  const [icon, setIcon] = useState<HabitIcon>(editHabit?.icon ?? 'Dumbbell');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'custom'>(editHabit?.frequency ?? 'daily');
  const [customDays, setCustomDays] = useState<number[]>(editHabit?.customDays ?? []);

  const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    if (editHabit) {
      updateHabit(editHabit.id, { name: name.trim(), description, color, icon, frequency, customDays });
    } else {
      addHabit({ name: name.trim(), description, color, icon, frequency, customDays });
    }
    onClose();
  }

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const cardClass = theme === 'dark'
    ? 'bg-slate-900 border border-slate-700 text-slate-100'
    : 'bg-white border border-slate-200 text-slate-900';

  const inputClass = theme === 'dark'
    ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-violet-500'
    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-violet-400';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className={`relative w-full max-w-md rounded-2xl shadow-2xl ${cardClass} z-10`}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
          <h2 className="text-lg font-bold">
            {editHabit ? 'Edit Habit' : 'New Habit'}
          </h2>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Name */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              Habit Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Run, Read 30 min..."
              required
              autoFocus
              className={`w-full px-3 py-2.5 rounded-xl border outline-none transition-colors text-sm ${inputClass}`}
            />
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              Description <span className={theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}>(optional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short note..."
              className={`w-full px-3 py-2.5 rounded-xl border outline-none transition-colors text-sm ${inputClass}`}
            />
          </div>

          {/* Frequency */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              Frequency
            </label>
            <div className="flex gap-2">
              {(['daily', 'weekly', 'custom'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFrequency(f)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                    frequency === f
                      ? 'bg-violet-500 text-white shadow-md'
                      : theme === 'dark'
                      ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Custom day picker */}
            {frequency === 'custom' && (
              <div className="flex gap-1.5 mt-2">
                {DAY_LABELS.map((day, idx) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() =>
                      setCustomDays((prev) =>
                        prev.includes(idx) ? prev.filter((d) => d !== idx) : [...prev, idx]
                      )
                    }
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      customDays.includes(idx)
                        ? `${COLOR_MAP[color].bg} text-white`
                        : theme === 'dark'
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Color */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full ${COLOR_MAP[c].bg} transition-all hover:scale-110 flex items-center justify-center ${
                    color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : ''
                  }`}
                >
                  {color === c && <Check size={14} className="text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Icon */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              Icon
            </label>
            <div className="grid grid-cols-6 gap-2">
              {ICONS.map((ic: HabitIcon) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`aspect-square rounded-xl flex items-center justify-center transition-all hover:scale-105 ${
                    icon === ic
                      ? `${COLOR_MAP[color].bgLight} ${COLOR_MAP[color].text} ring-1 ${COLOR_MAP[color].border}`
                      : theme === 'dark'
                      ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  <HabitIconComponent name={ic} size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all ${
                theme === 'dark'
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:scale-[1.02] shadow-md ${COLOR_MAP[color].bg}`}
            >
              {editHabit ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
