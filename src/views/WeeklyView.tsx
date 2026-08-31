import { useHabitStore } from '../store/habitStore';
import { WeeklyChart } from '../components/WeeklyChart';
import { getCurrentWeekDates, formatShortDate, calculateStreak } from '../utils/gamification';
import { COLOR_MAP } from '../utils/colors';
import { HabitIconComponent } from '../components/HabitIconComponent';
import { Flame } from 'lucide-react';

export function WeeklyView() {
  const { habits, checkIns, theme } = useHabitStore();
  const weekDates = getCurrentWeekDates();

  const cardBase = theme === 'dark'
    ? 'bg-slate-900 border border-slate-800'
    : 'bg-white border border-slate-200';

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          Weekly View
        </h1>
        <p className={`text-sm mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
          Your progress this week
        </p>
      </div>

      {/* Chart */}
      <WeeklyChart />

      {/* Per-habit detailed table */}
      {habits.length > 0 && (
        <div className={`rounded-2xl overflow-hidden ${cardBase}`}>
          <div className={`px-5 py-3 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
            <h3 className={`font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
              Day-by-Day Breakdown
            </h3>
          </div>

          {/* Header row */}
          <div className={`grid grid-cols-[1fr_repeat(7,_2rem)] gap-2 px-5 py-2 ${
            theme === 'dark' ? 'border-b border-slate-800' : 'border-b border-slate-100'
          }`}>
            <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
              Habit
            </span>
            {weekDates.map((date) => {
              const label = formatShortDate(date);
              const isToday = date === new Date().toISOString().slice(0, 10);
              return (
                <span
                  key={date}
                  className={`text-[10px] font-semibold text-center ${
                    isToday ? 'text-violet-400' : theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {label.split(' ')[0]}
                </span>
              );
            })}
          </div>

          {/* Habit rows */}
          <div className="divide-y divide-slate-800/30">
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

              return (
                <div
                  key={habit.id}
                  className={`grid grid-cols-[1fr_repeat(7,_2rem)] gap-2 px-5 py-3 items-center ${
                    theme === 'dark' ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                  } transition-colors`}
                >
                  {/* Name + streak */}
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${c.bgLight} ${c.text}`}>
                      <HabitIconComponent name={habit.icon} size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                        {habit.name}
                      </p>
                      {streak > 0 && (
                        <p className={`text-[10px] flex items-center gap-0.5 ${c.text}`}>
                          <Flame size={9} />
                          {streak}d streak
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Day cells */}
                  {weekDates.map((date) => {
                    const done = checkIns.some(
                      (ci) => ci.habitId === habit.id && ci.date === date
                    );
                    const isToday = date === new Date().toISOString().slice(0, 10);
                    const isFuture = date > new Date().toISOString().slice(0, 10);

                    return (
                      <div key={date} className="flex justify-center">
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold transition-all ${
                            done
                              ? `${c.bg} text-white`
                              : isFuture
                              ? theme === 'dark' ? 'bg-slate-800/30 text-slate-700' : 'bg-slate-50 text-slate-300'
                              : isToday
                              ? theme === 'dark' ? 'bg-slate-800 text-slate-500 ring-1 ring-violet-500/30' : 'bg-slate-100 text-slate-400 ring-1 ring-violet-400/30'
                              : theme === 'dark' ? 'bg-slate-800 text-slate-600' : 'bg-slate-100 text-slate-300'
                          }`}
                        >
                          {done ? '✓' : ''}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
