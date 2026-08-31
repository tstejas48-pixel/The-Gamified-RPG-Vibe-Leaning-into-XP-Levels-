import { Sun, Moon } from 'lucide-react';
import { useHabitStore } from '../store/habitStore';

export function ThemeToggle() {
  const { theme, toggleTheme } = useHabitStore();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 ${
        theme === 'dark'
          ? 'bg-slate-800 text-amber-400 hover:bg-slate-700'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
