import type { HabitColor } from '../store/habitStore';

export const COLOR_MAP: Record<HabitColor, {
  bg: string;
  bgLight: string;
  text: string;
  border: string;
  hex: string;
  tailwind: string;
}> = {
  emerald: {
    bg:      'bg-emerald-500',
    bgLight: 'bg-emerald-500/10',
    text:    'text-emerald-400',
    border:  'border-emerald-500/30',
    hex:     '#10b981',
    tailwind: 'emerald',
  },
  violet: {
    bg:      'bg-violet-500',
    bgLight: 'bg-violet-500/10',
    text:    'text-violet-400',
    border:  'border-violet-500/30',
    hex:     '#8b5cf6',
    tailwind: 'violet',
  },
  amber: {
    bg:      'bg-amber-500',
    bgLight: 'bg-amber-500/10',
    text:    'text-amber-400',
    border:  'border-amber-500/30',
    hex:     '#f59e0b',
    tailwind: 'amber',
  },
  rose: {
    bg:      'bg-rose-500',
    bgLight: 'bg-rose-500/10',
    text:    'text-rose-400',
    border:  'border-rose-500/30',
    hex:     '#f43f5e',
    tailwind: 'rose',
  },
  sky: {
    bg:      'bg-sky-500',
    bgLight: 'bg-sky-500/10',
    text:    'text-sky-400',
    border:  'border-sky-500/30',
    hex:     '#0ea5e9',
    tailwind: 'sky',
  },
  orange: {
    bg:      'bg-orange-500',
    bgLight: 'bg-orange-500/10',
    text:    'text-orange-400',
    border:  'border-orange-500/30',
    hex:     '#f97316',
    tailwind: 'orange',
  },
  pink: {
    bg:      'bg-pink-500',
    bgLight: 'bg-pink-500/10',
    text:    'text-pink-400',
    border:  'border-pink-500/30',
    hex:     '#ec4899',
    tailwind: 'pink',
  },
  teal: {
    bg:      'bg-teal-500',
    bgLight: 'bg-teal-500/10',
    text:    'text-teal-400',
    border:  'border-teal-500/30',
    hex:     '#14b8a6',
    tailwind: 'teal',
  },
};

export const COLORS: HabitColor[] = [
  'emerald', 'violet', 'amber', 'rose', 'sky', 'orange', 'pink', 'teal',
];
