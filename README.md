# ⚒️ HabitForge

> **Build better habits. Earn XP. Level up your life.**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-violet.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-18-blue)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](#)
[![Zustand](https://img.shields.io/badge/Zustand-state-orange)](#)

HabitForge is a **gamified habit tracker** built as a clean, mobile-first SPA. Track your daily habits, maintain streaks, earn XP, level up, and unlock badges — all stored offline in your browser.

---

## ✨ Features

- 🎯 **Habit Management** — Create, edit, delete habits with custom names, icons, colors & frequency
- 🔥 **Streak Tracking** — Consecutive day counters with ❄️ Freeze Days (skip without breaking streaks)
- ⚡ **XP & Levels** — Earn XP per check-in with streak bonuses, level up on a smooth curve
- 🏆 **Badges / Trophies** — 12 unlockable achievements (First Habit, 7-Day Streak, Iron Will, etc.)
- 📊 **Weekly Analytics** — Recharts bar chart + day-by-day completion grid
- 🌡️ **Calendar Heatmap** — GitHub-style 63-day activity grid per habit and globally
- 🌙 **Dark / Light Mode** — Toggle with one click; preference saved to localStorage
- 📱 **Mobile-First** — Responsive single-column on mobile, grid on desktop
- 💾 **100% Offline** — All data in localStorage via Zustand persist middleware

---

## 🖼️ Screenshots

> Add screenshot here (Daily view, dark mode)

> Add screenshot here (Analytics / Heatmap view)

> Add screenshot here (Trophies / Badges view)

---

## 🚀 Live Demo

[https://yourname.github.io/habitforge](https://yourname.github.io/habitforge)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS 4 |
| State | Zustand (with `persist` middleware) |
| Charts | Recharts |
| Icons | Lucide React |
| Storage | localStorage (built-in) |
| Language | TypeScript |

---

## 💻 Run Locally

```bash
# Clone the repo
git clone https://github.com/yourname/habitforge.git
cd habitforge

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── BadgeShowcase.tsx    # Trophy grid (locked/unlocked)
│   ├── CalendarHeatmap.tsx  # GitHub-style activity grid
│   ├── CheckInButton.tsx    # Animated toggle button
│   ├── HabitCard.tsx        # Full habit card with expand
│   ├── HabitForm.tsx        # Add/edit modal form
│   ├── HabitIconComponent.tsx
│   ├── Layout.tsx           # Header + bottom nav
│   ├── StatsCard.tsx        # Summary stats (XP, streak, etc.)
│   ├── StreakDisplay.tsx     # Streak badge
│   ├── ThemeToggle.tsx      # Dark/light toggle
│   ├── Toast.tsx            # XP check-in notification
│   └── XPProgress.tsx       # Level + progress bar
├── store/
│   └── habitStore.ts        # Zustand store + localStorage sync
├── utils/
│   ├── colors.ts            # Color palette map
│   └── gamification.ts      # XP, levels, streaks, badges, dates
├── views/
│   ├── AnalyticsView.tsx    # Heatmaps + completion rate
│   ├── BadgesView.tsx       # Trophy room
│   ├── DailyView.tsx        # Today's habits (main view)
│   ├── HabitsView.tsx       # Manage all habits
│   └── WeeklyView.tsx       # Week grid + Recharts bar chart
├── App.tsx
├── main.tsx
└── index.css
```

---

## 🔮 Future Ideas

- [ ] 📱 PWA + offline install prompt
- [ ] 🔔 Browser push notifications at custom times
- [ ] 📤 CSV export of check-in history
- [ ] ☁️ Firebase / Supabase sync for multi-device
- [ ] 📅 Monthly view & yearly wrapped
- [ ] 🤝 Habit sharing & accountability partners
- [ ] 🎨 Custom themes beyond dark/light
- [ ] 📊 Detailed per-habit analytics (best day, worst day, average)

---

## 📄 License

MIT © 2024 — See [LICENSE](./LICENSE)
