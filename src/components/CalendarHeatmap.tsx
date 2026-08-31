import { useHabitStore, type HabitColor } from '../store/habitStore';
import { getHeatmapData, formatMonthDay } from '../utils/gamification';
import { COLOR_MAP } from '../utils/colors';

interface CalendarHeatmapProps {
  habitId?: string; // if undefined, show global heatmap
  color?: HabitColor;
  days?: number;
}

const INTENSITY_ALPHA = ['0', '33', '66', '99', 'ff'];

export function CalendarHeatmap({
  habitId,
  color = 'violet',
  days = 63,
}: CalendarHeatmapProps) {
  const { habits, checkIns, theme } = useHabitStore();

  // Filter to just this habit if specified
  const filteredHabits = habitId ? habits.filter((h) => h.id === habitId) : habits;
  const cells = getHeatmapData(filteredHabits, checkIns, days);

  const c = COLOR_MAP[color];

  // Build 7-column grid (weeks as columns)
  const weeks: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function getCellColor(intensity: number, total: number): string {
    if (total === 0) return theme === 'dark' ? '#1e293b' : '#e2e8f0'; // no habits tracked
    if (intensity === 0) return theme === 'dark' ? '#0f172a' : '#f1f5f9'; // tracked but no check-in
    const hex = c.hex;
    const alpha = INTENSITY_ALPHA[intensity] ?? 'ff';
    return `${hex}${alpha}`;
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {/* Day labels */}
        <div className="flex flex-col gap-1 pr-1">
          <div className="h-4" /> {/* month label spacer */}
          {DAY_LABELS.map((d) => (
            <div
              key={d}
              className={`h-3 w-7 text-[9px] leading-3 flex items-center ${
                theme === 'dark' ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Weeks */}
        {weeks.map((week, wi) => {
          // Show month label on first cell of each week that changes month
          const firstCell = week[0];
          const showMonth =
            wi === 0 ||
            firstCell?.date.slice(5, 7) !== weeks[wi - 1]?.[0]?.date.slice(5, 7);
          const monthLabel = firstCell
            ? new Date(firstCell.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })
            : '';

          return (
            <div key={wi} className="flex flex-col gap-1">
              {/* Month label */}
              <div className={`h-4 text-[9px] font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                {showMonth ? monthLabel : ''}
              </div>

              {/* Days */}
              {week.map((cell, di) => (
                <div
                  key={di}
                  title={`${formatMonthDay(cell.date)}: ${cell.count}/${cell.total} habits`}
                  className="w-3 h-3 rounded-[2px] cursor-default transition-all hover:scale-125"
                  style={{ backgroundColor: getCellColor(cell.intensity, cell.total) }}
                />
              ))}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1 mt-2 justify-end">
        <span className={`text-[10px] ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>Less</span>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-[2px]"
            style={{ backgroundColor: getCellColor(i, i === 0 ? 1 : 1) }}
          />
        ))}
        <span className={`text-[10px] ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>More</span>
      </div>
    </div>
  );
}
