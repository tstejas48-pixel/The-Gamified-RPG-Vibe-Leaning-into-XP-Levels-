import { useState } from 'react';
import { Check } from 'lucide-react';
import { useHabitStore, type HabitColor } from '../store/habitStore';
import { COLOR_MAP } from '../utils/colors';

interface CheckInButtonProps {
  habitId: string;
  color: HabitColor;
}

export function CheckInButton({ habitId, color }: CheckInButtonProps) {
  const { toggleCheckIn, isCheckedIn, theme } = useHabitStore();
  const [animating, setAnimating] = useState(false);
  const checked = isCheckedIn(habitId);
  const c = COLOR_MAP[color];

  function handleClick() {
    setAnimating(true);
    toggleCheckIn(habitId);
    setTimeout(() => setAnimating(false), 400);
  }

  return (
    <button
      onClick={handleClick}
      title={checked ? 'Mark as incomplete' : 'Mark as done'}
      style={checked ? { backgroundColor: c.hex } : { borderColor: c.hex, color: c.hex }}
      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 font-bold flex-shrink-0
        ${animating ? 'scale-125' : 'hover:scale-110'}
        ${checked
          ? 'text-white shadow-md'
          : `border-2 ${theme === 'dark' ? 'hover:opacity-90' : 'hover:opacity-80'}`
        }
      `}
    >
      {checked ? (
        <Check size={16} strokeWidth={3} />
      ) : (
        <span className="w-3 h-3 rounded-sm border-2 border-current opacity-60" />
      )}
    </button>
  );
}
