import { useEffect, useState } from 'react';
import { Zap, Check } from 'lucide-react';

interface ToastProps {
  message: string;
  xp?: number;
  onDone: () => void;
}

export function Toast({ message, xp, onDone }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className={`fixed bottom-24 md:bottom-8 left-1/2 z-50 transform -translate-x-1/2
        flex items-center gap-2 px-4 py-3 rounded-2xl shadow-2xl
        bg-slate-800 text-white border border-slate-700
        transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
        <Check size={14} strokeWidth={3} />
      </div>
      <span className="text-sm font-medium">{message}</span>
      {xp !== undefined && (
        <div className="flex items-center gap-1 bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-lg ml-1">
          <Zap size={12} />
          <span className="text-xs font-bold">+{xp} XP</span>
        </div>
      )}
    </div>
  );
}
