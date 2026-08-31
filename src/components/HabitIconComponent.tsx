import {
  Dumbbell,
  BookOpen,
  Droplets,
  Moon,
  Apple,
  Brain,
  Heart,
  Music,
  Pencil,
  Coffee,
  Zap,
  Bike,
  type LucideProps,
} from 'lucide-react';
import type { HabitIcon } from '../store/habitStore';

export const ICONS: HabitIcon[] = [
  'Dumbbell', 'BookOpen', 'Droplets', 'Moon', 'Apple',
  'Brain', 'Heart', 'Music', 'Pencil', 'Run', 'Coffee', 'Zap',
];

const ICON_MAP: Record<HabitIcon, React.ComponentType<LucideProps>> = {
  Dumbbell,
  BookOpen,
  Droplets,
  Moon,
  Apple,
  Brain,
  Heart,
  Music,
  Pencil,
  Run: Bike, // Lucide doesn't have Run; Bike is a good substitute
  Coffee,
  Zap,
};

interface Props {
  name: HabitIcon;
  size?: number;
  className?: string;
}

export function HabitIconComponent({ name, size = 20, className }: Props) {
  const Icon = ICON_MAP[name] ?? Zap;
  return <Icon size={size} className={className} />;
}
