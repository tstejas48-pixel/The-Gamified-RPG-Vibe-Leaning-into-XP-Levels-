import { Lock } from 'lucide-react';
import { useHabitStore } from '../store/habitStore';
import { formatMonthDay } from '../utils/gamification';

export function BadgeShowcase() {
  const { badges, theme } = useHabitStore();

  const unlocked = badges.filter((b) => b.unlockedAt);
  const locked = badges.filter((b) => !b.unlockedAt);

  const cardBase = theme === 'dark'
    ? 'bg-slate-900 border border-slate-800'
    : 'bg-white border border-slate-200';

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className={`rounded-2xl p-4 flex items-center justify-between ${cardBase}`}>
        <div>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Badges Earned</p>
          <p className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {unlocked.length}
            <span className={`text-base font-normal ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
              /{badges.length}
            </span>
          </p>
        </div>
        <div className="text-4xl">🏆</div>
      </div>

      {/* Unlocked badges */}
      {unlocked.length > 0 && (
        <div>
          <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            Unlocked
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {unlocked.map((badge) => (
              <div
                key={badge.id}
                className={`rounded-2xl p-4 flex flex-col items-center text-center gap-2 transition-all hover:scale-[1.02] ${cardBase}`}
              >
                <span className="text-3xl">{badge.icon}</span>
                <div>
                  <p className={`font-bold text-sm ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
                    {badge.name}
                  </p>
                  <p className={`text-[11px] mt-0.5 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                    {badge.description}
                  </p>
                  {badge.unlockedAt && (
                    <p className="text-[10px] mt-1 text-violet-400 font-medium">
                      {formatMonthDay(badge.unlockedAt)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked badges */}
      {locked.length > 0 && (
        <div>
          <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            Locked
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {locked.map((badge) => (
              <div
                key={badge.id}
                className={`rounded-2xl p-4 flex flex-col items-center text-center gap-2 opacity-40 ${cardBase}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
                }`}>
                  <Lock size={18} className={theme === 'dark' ? 'text-slate-600' : 'text-slate-400'} />
                </div>
                <div>
                  <p className={`font-bold text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    {badge.name}
                  </p>
                  <p className={`text-[11px] mt-0.5 ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>
                    {badge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
