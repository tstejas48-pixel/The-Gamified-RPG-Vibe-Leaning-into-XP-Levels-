import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { DailyView } from './views/DailyView';
import { WeeklyView } from './views/WeeklyView';
import { AnalyticsView } from './views/AnalyticsView';
import { HabitsView } from './views/HabitsView';
import { BadgesView } from './views/BadgesView';
import { Toast } from './components/Toast';
import { useHabitStore } from './store/habitStore';

type View = 'daily' | 'weekly' | 'analytics' | 'habits' | 'badges';

function App() {
  const [currentView, setCurrentView] = useState<View>('daily');
  const { theme, _recalculate, toasts, removeToast, habits, addHabit, checkIns } = useHabitStore();

  // Ensure theme is applied on initial load
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    // Trigger badge recalc on mount in case store was just rehydrated
    _recalculate();
  }, []);

  // Seed demo data if this is a fresh install (no habits yet)
  useEffect(() => {
    if (habits.length === 0 && checkIns.length === 0) {
      // Add a few starter habits silently
      addHabit({ name: 'Morning Run', description: 'Get moving before 8am', frequency: 'daily', color: 'emerald', icon: 'Run' });
      addHabit({ name: 'Read 30 min', description: 'Books only, no social media', frequency: 'daily', color: 'violet', icon: 'BookOpen' });
      addHabit({ name: 'Drink Water', description: '8 glasses a day', frequency: 'daily', color: 'sky', icon: 'Droplets' });
    }
  }, []);

  const views: Record<View, React.ReactNode> = {
    daily:     <DailyView />,
    weekly:    <WeeklyView />,
    analytics: <AnalyticsView />,
    habits:    <HabitsView />,
    badges:    <BadgesView />,
  };

  return (
    <>
      <Layout currentView={currentView} onViewChange={setCurrentView}>
        {views[currentView]}
      </Layout>

      {/* Global toasts */}
      {toasts.slice(-1).map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          xp={t.xp}
          onDone={() => removeToast(t.id)}
        />
      ))}
    </>
  );
}

export default App;
