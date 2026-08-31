import { Zap } from 'lucide-react';
import { useHabitStore } from '../store/habitStore';
import { calculateLevel, levelProgress, xpForNextLevel, xpForCurrentLevel } from '../utils/gamification';

interface XPProgressProps {
  compact?: boolean;
}

export function XPProgress({ compact = false }: XPProgressProps) {
  const { totalXP, theme } = useHabitStore();
  const level = calculateLevel(totalXP);
  const progress = levelProgress(totalXP);
  const xpCurrent = xpForCurrentLevel(level);
  const xpNext = xpForNextLevel(level);
  const xpInLevel = totalXP - xpCurrent;
  const xpNeeded = xpNext - xpCurrent;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
            <span className="text-white text-[10px] font-black">{level}</span>
          </div>
          <div className="hidden sm:block w-20 h-1.5 rounded-full overflow-hidden bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-0.5 text-amber-400">
          <Zap size={12} />
          <span className="text-xs font-bold">{totalXP}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl p-5 ${
      theme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'
    }`}>
      {/* Level badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 flex flex-col items-center justify-center shadow-lg shadow-violet-500/20">
            <span className="text-white text-[10px] font-semibold uppercase tracking-widest">LVL</span>
            <span className="text-white text-2xl font-black leading-none">{level}</span>
          </div>
          <div>
            <p className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Level {level}
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {xpInLevel} / {xpNeeded} XP to next level
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-xl">
          <Zap size={14} />
          <span className="font-bold text-sm">{totalXP} XP</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className={`w-full h-3 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 transition-all duration-700 rounded-full"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className={`text-[11px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
          Level {level}
        </span>
        <span className={`text-[11px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
          Level {level + 1}
        </span>
      </div>
    </div>
  );
}
