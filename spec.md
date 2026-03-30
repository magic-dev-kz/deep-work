# Deep Work Timer — Product Specification

**Product:** Deep Work Timer
**Type:** Single-page web app (PWA-ready)
**Author:** Sanya, Product Manager @ OpenClaw
**Date:** 2026-03-29
**Version:** 1.0

---

## Why "Deep Work", not the others

| Variant | Verdict |
|---------|---------|
| Focus Forest | Gamification gimmick. Novelty wears off in 14 days. Forest already owns this niche with 50M+ installs — competing on "better design" alone is a losing strategy. |
| Zen Timer | Ambient sounds are a commodity. Any Spotify playlist replaces this. Tide charges $2.99/mo for what amounts to a sound player with a timer. No defensible value. |
| **Deep Work** | **Real pain point.** Freelancers and developers want proof of productive hours — for clients, for self-accountability, for taxes. GitHub-style heatmap is an instantly recognizable visual language for the target audience. No free browser tool does this well.** |

---

## 1. Persona

**Name:** Dima, 28, freelance frontend developer, Moscow.

- Works from home, juggles 2-3 client projects.
- Bills clients hourly but has no idea how many hours are actually "deep work" vs shallow tasks.
- Uses GitHub daily — the contribution heatmap is his favorite motivator.
- Tried Forest — felt childish after a week. Tried Toggl — too heavy for just tracking focus.
- Wants: start timer, work, see stats. Nothing else.
- Device: MacBook, Chrome. Sometimes checks phone but primary use is desktop browser.
- Will NOT pay for a timer app. Will NOT create an account.

---

## 2. Main Function

A Pomodoro timer that records every completed focus session and visualizes accumulated deep work as a GitHub-style heatmap calendar. One screen. No auth. No server.

**Core loop:**
1. User clicks "Start" — 25-minute focus countdown begins.
2. Timer completes — session is logged (date, duration, tag).
3. User sees updated heatmap + daily/weekly/monthly totals.
4. 5-minute break countdown auto-starts (skippable).
5. Every 4th session — 15-minute long break.

---

## 3. The Hook (Izium)

**"Your year in deep work" heatmap.**

A 365-day grid (52 weeks x 7 days) identical in layout to GitHub's contribution graph. Each cell represents one day. Color intensity = total deep work minutes that day:

| Minutes | Color | Hex |
|---------|-------|-----|
| 0 | Empty | #161b22 |
| 1-60 | Level 1 | #0e4429 |
| 61-120 | Level 2 | #006d32 |
| 121-180 | Level 3 | #26a641 |
| 181+ | Level 4 | #39d353 |

Hover over any cell — tooltip shows: "March 29, 2026: 3h 25m deep work (8 sessions)".

**Secondary hook:** streak counter. "Current streak: 12 days. Longest: 34 days." Visible at all times. Missing one day resets the streak to 0.

---

## 4. Acceptance Criteria

### AC-1: Timer accuracy
The timer MUST NOT drift more than 500ms over a 25-minute session. Implementation MUST use `Date.now()` delta calculation, NOT `setInterval` counting.

### AC-2: Focus session duration options
User can select from exactly 4 focus durations: 15, 25, 35, 50 minutes. Default is 25. Break durations are fixed: 5 minutes (short), 15 minutes (long). Long break triggers after every 4th completed focus session.

### AC-3: Heatmap rendering
The heatmap MUST render exactly 371 cells (53 columns x 7 rows). Each cell MUST be 12x12 px with 3px gap. Total heatmap width: 53 * (12 + 3) - 3 = 792px. Day-of-week labels (Mon, Wed, Fri) on the left axis. Month labels (Jan-Dec) on the top axis.

### AC-4: Data persistence
All session data MUST be stored in `localStorage` under key `deepwork_sessions`. Format: JSON array of objects `{ts: number, duration: number, tag: string}`. `ts` is Unix timestamp (ms) of session start. `duration` is actual completed minutes. App MUST handle `localStorage` being full (quota exceeded) by showing a warning and still functioning as a timer.

### AC-5: Session tagging
User can assign exactly 1 tag per session from a preset list of 6 tags: "Code", "Design", "Writing", "Learning", "Planning", "Other". Tag is selected BEFORE starting the timer. Default tag is "Code". Tags are shown as colored dots on the heatmap tooltip.

### AC-6: Statistics panel
Stats panel MUST display 4 metrics, updated in real-time after each session:
- Today: total minutes and session count (e.g., "2h 15m / 5 sessions")
- This week (Mon-Sun): total hours (e.g., "18.5h")
- This month: total hours (e.g., "72h")
- Current streak / Longest streak (e.g., "12 days / 34 days")

### AC-7: Touch targets and accessibility
All clickable elements MUST have minimum dimensions of 44x44 px (Apple HIG). Timer start/pause button MUST be minimum 64x64 px. All text MUST meet WCAG 2.1 AA contrast ratio (4.5:1 minimum for normal text, 3:1 for large text). Font size for timer digits: 72px minimum. Font size for stats: 16px minimum.

### AC-8: Notification on session end
App MUST play an audio chime (duration: 800-1200ms, format: synthesized via Web Audio API, no external file) when a focus or break session ends. App MUST also fire a browser Notification (if permission granted) with text "Focus session complete! Time for a break." or "Break over! Ready for deep work?".

### AC-9: Data export
User can export all session data as a CSV file with columns: `date,start_time,duration_minutes,tag`. Filename format: `deepwork_export_YYYY-MM-DD.csv`. Export button visible in stats panel. CSV MUST include header row. Dates in ISO 8601 format.

### AC-10: Responsive layout
Single breakpoint at 600px.
- Above 600px: heatmap and stats side by side, timer centered above.
- At or below 600px: vertical stack — timer, then stats, then heatmap (horizontal scroll enabled for heatmap). Minimum supported viewport width: 320px.

---

## 5. What NOT To Do

1. **No accounts, no auth, no server.** Everything runs locally. Zero backend.
2. **No gamification beyond the heatmap and streak.** No points, no levels, no badges, no leaderboards, no trees, no animals.
3. **No ambient sounds.** This is not a meditation app. One short chime on session end — that's it.
4. **No AI features.** No "AI-powered focus insights". No LLM calls.
5. **No framework.** No React, no Vue, no Svelte. Vanilla HTML/CSS/JS only.
6. **No build step.** No webpack, no Vite, no npm. Open `index.html` in browser — it works.
7. **No premium tier.** No "upgrade to unlock monthly stats". Everything is free, forever.
8. **No mobile app.** Web only. PWA manifest is acceptable but not required in v1.
9. **No dark/light theme toggle.** Dark theme only (matches GitHub dark mode and the target audience preference).
10. **No tutorial or onboarding.** The UI must be self-explanatory. If it needs a tutorial, the design is wrong.

---

## 6. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Structure | 1 HTML file (`index.html`) | Zero build, instant deploy |
| Styling | Inline `<style>` block, CSS custom properties | No external CSS files. Variables for colors enable future theming if needed |
| Logic | Inline `<script>` block, vanilla ES6+ | No modules, no imports. Single-file app |
| Storage | `localStorage` | No IndexedDB (overkill). Max practical storage: 5MB = ~50,000 sessions |
| Audio | Web Audio API (`OscillatorNode`) | No external audio files to load |
| Notifications | Notification API | Graceful degradation: if denied, chime still plays |
| Fonts | System font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` | Zero network requests |
| Icons | Inline SVG (play, pause, skip, download) | No icon library, no font-awesome |
| Hosting | Any static hosting (GitHub Pages, Netlify, open from file) | No server requirements |

### File structure
```
pomodoro/
  index.html    — the entire app (HTML + CSS + JS)
  spec.md       — this file
```

### localStorage schema
```json
{
  "deepwork_sessions": [
    {"ts": 1711699200000, "duration": 25, "tag": "Code"},
    {"ts": 1711701600000, "duration": 25, "tag": "Writing"}
  ],
  "deepwork_settings": {
    "focusDuration": 25,
    "defaultTag": "Code"
  }
}
```

### Color palette (CSS custom properties)
```css
:root {
  --bg-primary: #0d1117;
  --bg-secondary: #161b22;
  --bg-tertiary: #21262d;
  --text-primary: #f0f6fc;
  --text-secondary: #8b949e;
  --accent: #58a6ff;
  --green-0: #161b22;
  --green-1: #0e4429;
  --green-2: #006d32;
  --green-3: #26a641;
  --green-4: #39d353;
  --danger: #f85149;
}
```

---

## Metrics for Success (post-launch)

Not part of v1 implementation, but how we'll know it works:

- User opens the app and starts first session within 8 seconds (no friction).
- User returns next day (retention signal via streak feature).
- Heatmap has 30+ days of data (long-term engagement).

Measured by: user feedback + localStorage inspection on voluntary basis.
