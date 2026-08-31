import { useHabitStore } from '../store/habitStore';
import { CalendarHeatmap } from '../components/CalendarHeatmap';
import { XPProgress } from '../components/XPProgress';
import { COLOR_MAP } from '../utils/colors';
import { HabitIconComponent } from '../components/HabitIconComponent';
import { calculateStreak, getHeatmapData } from '../utils/gamification';

export function AnalyticsView() {
  const { habits, checkIns, theme } = useHabitStore();

  const cardBase = theme === 'dark'
    ? 'bg-slate-900 border border-slate-800'
    : 'bg-white border border-slate-200';

  // Total completion rate (all time)
  const totalPossible = habits.reduce((sum, h) => {
    const daysActive = Math.max(
      1,
      Math.floor(
        (Date.now() - new Date(h.createdAt + 'T00:00:00').getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1
    );
    return sum + daysActive;
  }, 0);
  const totalDone = checkIns.length;
  const overallRate = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          Analytics
        </h1>
        <p className={`text-sm mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
          Your activity over the last 63 days
        </p>
      </div>

      {/* XP Panel */}
      <XPProgress />

      {/* Overall rate */}
      <div className={`rounded-2xl p-5 ${cardBase}`}>
        <h3 className={`font-bold text-base mb-4 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
          Overall Completion Rate
        </h3>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40" cy="40" r="32"
                fill="none"
                stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'}
                strokeWidth="8"
              />
              <circle
                cx="40" cy="40" r="32"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - overallRate / 100)}`}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {overallRate}%
              </span>
            </div>
          </div>
          <div>
            <p className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {totalDone} <span className={`text-base font-normal ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>check-ins</span>
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              across {habits.length} habit{habits.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Global heatmap */}
      <div className={`rounded-2xl p-5 ${cardBase}`}>
        <h3 className={`font-bold text-base mb-4 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
          Activity Heatmap — All Habits
        </h3>
        {habits.length === 0 ? (
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
            Create habits to see your heatmap.
          </p>
        ) : (
          <CalendarHeatmap days={63} />
        )}
      </div>

      {/* Per-habit heatmaps */}
      {habits.map((habit) => {
        const c = COLOR_MAP[habit.color];
        const streak = (() => {
          const dates = checkIns
            .filter((ci) => ci.habitId === habit.id)
            .map((ci) => ci.date)
            .sort()
            .reverse();
          return calculateStreak(dates, habit.freezeDays);
        })();
        const cells = getHeatmapData([habit], checkIns, 63);
        const done = cells.filter((cell) => cell.intensity > 0).length;
        const total = cells.filter((cell) => cell.total > 0).length;
        const rate = total > 0 ? Math.round((done / total) * 100) : 0;

        return (
          <div key={habit.id} className={`rounded-2xl p-5 ${cardBase}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-9 h-9 rounded-xl ${c.bgLight} ${c.text} flex items-center justify-center`}>
                <HabitIconComponent name={habit.icon} size={18} />
              </div>
              <div className="flex-1">
                <p className={`font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                  {habit.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs ${c.text}`}>{rate}% completion</span>
                  {streak > 0 && (
                    <span className="text-xs text-amber-400">🔥 {streak}d streak</span>
                  )}
                </div>
              </div>
            </div>
            <CalendarHeatmap habitId={habit.id} color={habit.color} days={63} />
          </div>
        );
      })}
    </div>
  );
}
