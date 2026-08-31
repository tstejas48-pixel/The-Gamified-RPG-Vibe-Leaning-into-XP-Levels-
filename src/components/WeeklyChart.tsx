import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useHabitStore } from '../store/habitStore';
import { getWeeklyStats, getCurrentWeekDates, formatShortDate } from '../utils/gamification';
import { COLOR_MAP } from '../utils/colors';

export function WeeklyChart() {
  const { habits, checkIns, theme } = useHabitStore();
  const stats = getWeeklyStats(habits, checkIns);

  if (habits.length === 0) {
    return (
      <div className={`flex items-center justify-center h-40 rounded-2xl ${
        theme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'
      }`}>
        <p className={theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}>
          No habits yet. Create one to see your weekly progress!
        </p>
      </div>
    );
  }

  // Chart data: % completion per habit
  const chartData = stats.map((s) => ({
    name: s.name.length > 12 ? s.name.slice(0, 12) + '…' : s.name,
    fullName: s.name,
    pct: s.pct,
    checked: s.checked,
    total: s.total,
    color: COLOR_MAP[s.color as keyof typeof COLOR_MAP]?.hex ?? '#8b5cf6',
  }));

  const gridColor = theme === 'dark' ? '#1e293b' : '#f1f5f9';
  const textColor = theme === 'dark' ? '#64748b' : '#94a3b8';
  const cardBg = theme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200';

  return (
    <div className={`rounded-2xl p-5 ${cardBg}`}>
      <h3 className={`font-bold text-base mb-4 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
        This Week's Completion
      </h3>

      {/* Bar chart */}
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: textColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fill: textColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className={`px-3 py-2 rounded-xl shadow-lg text-sm ${
                  theme === 'dark' ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'bg-white text-slate-900 border border-slate-200'
                }`}>
                  <p className="font-semibold">{d.fullName}</p>
                  <p className="text-xs mt-0.5" style={{ color: d.color }}>
                    {d.checked}/{d.total} days — {d.pct}%
                  </p>
                </div>
              );
            }}
          />
          <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Per-habit progress rows */}
      <div className="mt-4 space-y-3">
        {stats.map((s) => {
          const c = COLOR_MAP[s.color as keyof typeof COLOR_MAP];
          return (
            <div key={s.habitId}>
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {s.name}
                </span>
                <span className={`text-xs font-semibold ml-2 flex-shrink-0 ${c?.text ?? 'text-violet-400'}`}>
                  {s.checked}/{s.total}d
                </span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${s.pct}%`,
                    backgroundColor: c?.hex ?? '#8b5cf6',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Day labels row */}
      <div className="mt-4 grid grid-cols-7 gap-1">
        {getCurrentWeekDates().map((date) => {
          const label = formatShortDate(date);
          const isToday = date === new Date().toISOString().slice(0, 10);
          const dayCheckCount = habits.filter((h) =>
            checkIns.some((c) => c.habitId === h.id && c.date === date)
          ).length;

          return (
            <div key={date} className="flex flex-col items-center gap-1">
              <span className={`text-[10px] font-medium ${isToday ? 'text-violet-400' : theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>
                {label.split(' ')[0]}
              </span>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                isToday
                  ? 'bg-violet-500/20 text-violet-400 ring-1 ring-violet-500/30'
                  : dayCheckCount === habits.length && habits.length > 0
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : theme === 'dark'
                  ? 'bg-slate-800 text-slate-500'
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {label.split(' ')[1]}
              </div>
              <span className={`text-[10px] ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>
                {dayCheckCount}/{habits.length}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
