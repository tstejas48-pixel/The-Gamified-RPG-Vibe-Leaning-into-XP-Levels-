import { useHabitStore } from '../store/habitStore';
import { BadgeShowcase } from '../components/BadgeShowcase';
import { XPProgress } from '../components/XPProgress';

export function BadgesView() {
  const { theme } = useHabitStore();

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          Trophies
        </h1>
        <p className={`text-sm mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
          Your achievements and badges
        </p>
      </div>

      <XPProgress />
      <BadgeShowcase />
    </div>
  );
}
