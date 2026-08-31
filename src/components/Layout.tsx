import React from 'react';
import {
  Flame,
  LayoutDashboard,
  BarChart2,
  Trophy,
  ListChecks,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { XPProgress } from './XPProgress';
import { useHabitStore } from '../store/habitStore';

type View = 'daily' | 'weekly' | 'analytics' | 'habits' | 'badges';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onViewChange: (view: View) => void;
}

const NAV_ITEMS: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: 'daily',     label: 'Today',     icon: <LayoutDashboard size={20} /> },
  { id: 'weekly',    label: 'Weekly',    icon: <ListChecks size={20} /> },
  { id: 'analytics', label: 'Heatmap',   icon: <Flame size={20} /> },
  { id: 'habits',    label: 'Habits',    icon: <BarChart2 size={20} /> },
  { id: 'badges',    label: 'Trophies',  icon: <Trophy size={20} /> },
];

export function Layout({ children, currentView, onViewChange }: LayoutProps) {
  const theme = useHabitStore((s) => s.theme);

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b ${
        theme === 'dark'
          ? 'bg-slate-950/80 border-slate-800'
          : 'bg-white/80 border-slate-200'
      }`}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center shadow-lg">
              <Flame size={16} className="text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
              HabitForge
            </span>
          </div>

          {/* XP + Theme toggle */}
          <div className="flex items-center gap-3">
            <XPProgress compact />
            <ThemeToggle />
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex max-w-5xl mx-auto px-4 gap-1 pb-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentView === item.id
                  ? 'bg-violet-500/20 text-violet-400'
                  : theme === 'dark'
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {/* ── Main ─────────────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 pb-24 md:pb-8">
        {children}
      </main>

      {/* ── Bottom Nav (mobile) ───────────────────────────────────────────────── */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-md ${
        theme === 'dark'
          ? 'bg-slate-950/90 border-slate-800'
          : 'bg-white/90 border-slate-200'
      }`}>
        <div className="flex justify-around items-center py-2 px-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                currentView === item.id
                  ? 'text-violet-400'
                  : theme === 'dark'
                  ? 'text-slate-500 hover:text-slate-300'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
