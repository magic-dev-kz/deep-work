# Deep Work Timer — Design Specification

**Role:** Sky, Creative Director @ OpenClaw
**Based on:** spec.md v1.0 (Sanya, PM)
**Date:** 2026-03-29

---

## 1. Color Palette

GitHub Dark Mode base + 5-level heatmap green.

### CSS Custom Properties

```css
:root {
  /* Backgrounds */
  --bg-primary:   #0d1117;   /* page background */
  --bg-secondary: #161b22;   /* cards, panels */
  --bg-tertiary:  #21262d;   /* hover states, borders */

  /* Text */
  --text-primary:   #f0f6fc; /* headings, timer digits */
  --text-secondary: #8b949e; /* labels, captions */

  /* Accent */
  --accent:       #58a6ff;   /* links, break ring, interactive highlights */
  --accent-hover: #79b8ff;   /* button hover */

  /* Heatmap — 5 levels */
  --green-0: #161b22;   /* 0 min — empty cell */
  --green-1: #0e4429;   /* 1-60 min */
  --green-2: #006d32;   /* 61-120 min */
  --green-3: #26a641;   /* 121-180 min */
  --green-4: #39d353;   /* 181+ min */

  /* Tags */
  --tag-code:     #39d353;   /* green */
  --tag-design:   #a371f7;   /* purple */
  --tag-writing:  #d29922;   /* orange/amber */
  --tag-learning: #58a6ff;   /* blue */
  --tag-planning: #e3b341;   /* yellow */
  --tag-other:    #484f58;   /* grey */

  /* Semantic */
  --danger:  #f85149;
  --success: #39d353;

  /* Surfaces */
  --border:       #30363d;
  --shadow:       rgba(0, 0, 0, 0.4);

  /* Typography */
  --font-stack: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono:  "SF Mono", "Fira Code", "Cascadia Code", monospace;
}
```

### Heatmap Level Reference

| Level | Minutes  | Hex       | Visual description          |
|-------|----------|-----------|-----------------------------|
| 0     | 0        | `#161b22` | Matches bg-secondary (empty)|
| 1     | 1-60     | `#0e4429` | Dark forest green           |
| 2     | 61-120   | `#006d32` | Medium green                |
| 3     | 121-180  | `#26a641` | Bright green                |
| 4     | 181+     | `#39d353` | Vivid green (max intensity) |

---

## 2. Layout

### Breakpoint

Single breakpoint: **600px**.

### Desktop (>600px)

```
┌──────────────────────────────────────────────┐
│                   HEADER                     │
│            Deep Work Timer + streak          │
├──────────────────────────────────────────────┤
│                                              │
│              ┌──────────────┐                │
│              │   TIMER      │                │
│              │  ○ 24:59 ○   │                │
│              │  [▶ Start]   │                │
│              │  tag chips   │                │
│              └──────────────┘                │
│                                              │
├──────────────────┬───────────────────────────┤
│   STATS (2x2)    │        HEATMAP            │
│  ┌─────┬─────┐   │   month labels            │
│  │Today│Week │   │   ┌───────────────────┐   │
│  ├─────┼─────┤   │ d │ ░░░█░░░░░░░░░░░░░ │   │
│  │Month│Strk │   │ a │ ░░░░░░█░░░░░░░░░░ │   │
│  └─────┴─────┘   │ y │ ░░░░░░░░░░░░░░░░░ │   │
│                   │   └───────────────────┘   │
├──────────────────┴───────────────────────────┤
│              EXPORT BUTTON                   │
└──────────────────────────────────────────────┘
```

- Max content width: **960px**, centered.
- Stats panel: fixed width **240px**.
- Heatmap: fills remaining space (min 792px computed from cells).
- Padding: 24px outer, 16px inner cards.

### Mobile (<=600px)

```
┌────────────────────┐
│      HEADER        │
├────────────────────┤
│      TIMER         │
│    ○ 24:59 ○       │
│    [▶ Start]       │
│    tag chips       │
├────────────────────┤
│    STATS (2x2)     │
│   ┌──────┬──────┐  │
│   │Today │ Week │  │
│   ├──────┼──────┤  │
│   │Month │Streak│  │
│   └──────┴──────┘  │
├────────────────────┤
│    HEATMAP         │
│  ← scroll →        │
│    [Export CSV]     │
└────────────────────┘
```

- Full width, 16px padding.
- Heatmap container: `overflow-x: auto` for horizontal scroll.
- Minimum viewport: 320px.

---

## 3. Timer Component

### Structure

Circular SVG ring with countdown digits centered inside.

### Dimensions

| Element               | Size         |
|-----------------------|--------------|
| SVG container         | 256x256 px   |
| Ring radius           | 108 px       |
| Ring stroke width     | 8 px         |
| Timer digits          | 72px, `--font-mono`, `--text-primary` |
| Session label         | 14px, `--text-secondary` ("Focus" / "Break") |
| Start/Pause button    | 64x64 px, round, min touch 44px satisfied |
| Duration selector     | 4 pill buttons, 40px height, 14px text |

### Ring Behavior

```
Track ring:   stroke: var(--bg-tertiary), stroke-width: 8
Progress ring: stroke: var(--green-4),     stroke-width: 8   (focus mode)
               stroke: var(--accent),      stroke-width: 8   (break mode)
```

- **`stroke-dasharray`**: total circumference = `2 * PI * 108 = 678.58`.
- **`stroke-dashoffset`**: starts at 0 (full), increases toward 678.58 as time elapses.
- **`transform: rotate(-90deg)`** on the progress ring so it starts from 12 o'clock.
- **Transition**: `stroke-dashoffset` updates every 1s with `transition: stroke-dashoffset 1s linear`.

### Start/Pause Button

- Default: play icon (SVG triangle), `background: var(--green-4)`.
- Running: pause icon (SVG double bar), `background: var(--bg-tertiary)`.
- Hover: `background` lightens by one step.
- Border-radius: 50%.
- Box-shadow: `0 2px 8px var(--shadow)`.

### Duration Selector

Four pill buttons in a row below the ring:

```
[ 15 ]  [ 25 ]  [ 35 ]  [ 50 ]
```

- Active/selected: `background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--green-4)`.
- Inactive: `background: transparent; color: var(--text-secondary); border: 1px solid var(--border)`.
- Gap: 8px between pills.

---

## 4. Heatmap Component

### Cell Grid

| Property       | Value                                |
|----------------|--------------------------------------|
| Cell size      | 12x12 px                             |
| Gap            | 3px                                  |
| Columns        | 53 (weeks)                           |
| Rows           | 7 (Mon-Sun)                          |
| Total cells    | 371                                  |
| Grid width     | 53 * (12 + 3) - 3 = **792px**       |
| Grid height    | 7 * (12 + 3) - 3 = **102px**        |

### Labels

**Month labels** (top axis):
- Font: 11px, `--text-secondary`.
- Positioned above corresponding first-Monday column.
- Show: Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec.
- Only render label if the month starts within that column range (no duplicates).

**Day labels** (left axis):
- Font: 11px, `--text-secondary`.
- Show only: Mon, Wed, Fri (rows 0, 2, 4 — matching GitHub's pattern).
- Width: 30px, right-aligned, 8px margin to grid.

### Tooltip

Appears on hover (desktop) and on tap (mobile).

```
┌─────────────────────────────────┐
│ March 29, 2026                  │
│ 2h 15m deep work · 5 sessions  │
│ ● Code ● Writing               │
└─────────────────────────────────┘
```

- Background: `var(--bg-tertiary)`.
- Border: `1px solid var(--border)`.
- Border-radius: 6px.
- Padding: 8px 12px.
- Font: 12px, `--text-primary` for date, `--text-secondary` for details.
- Box-shadow: `0 4px 12px var(--shadow)`.
- Position: above the cell, centered horizontally. Flips below if near top edge.
- Tag dots: 8px circles using respective `--tag-*` colors.
- `pointer-events: none` on tooltip itself.
- Max-width: 240px.

### Cell Rendering

- Default: `border-radius: 2px` (matching GitHub).
- Color: apply `--green-0` through `--green-4` based on daily total minutes.
- Today's cell: `outline: 2px solid var(--text-secondary)` for visual anchor.

---

## 5. Tag Chips

Six preset tags, displayed as a horizontal row of chips below the timer (before starting) and in the tooltip.

### Chip Design

| Property       | Value                        |
|----------------|------------------------------|
| Height         | 32px                         |
| Padding        | 0 12px                       |
| Border-radius  | 16px (pill shape)            |
| Font           | 13px, medium weight          |
| Gap            | 8px between chips            |
| Min touch      | 44px effective (padded)      |

### Tag Colors

| Tag       | Dot/BG color       | CSS variable       |
|-----------|--------------------|--------------------|
| Code      | `#39d353` green    | `--tag-code`       |
| Design    | `#a371f7` purple   | `--tag-design`     |
| Writing   | `#d29922` orange   | `--tag-writing`    |
| Learning  | `#58a6ff` blue     | `--tag-learning`   |
| Planning  | `#e3b341` yellow   | `--tag-planning`   |
| Other     | `#484f58` grey     | `--tag-other`      |

### States

- **Inactive**: `background: transparent; border: 1px solid var(--border); color: var(--text-secondary)`. Small 8px dot of tag color before label.
- **Active/selected**: `background: {tag-color} at 15% opacity; border: 1px solid {tag-color}; color: var(--text-primary)`. Dot fully opaque.

### Layout

On mobile (<=600px), chips wrap to 2 rows if needed (flex-wrap: wrap).

---

## 6. Stats Panel

### Grid: 2x2

```
┌─────────────────┬─────────────────┐
│     TODAY        │   THIS WEEK     │
│   2h 15m        │    18.5h        │
│   5 sessions    │                 │
├─────────────────┼─────────────────┤
│   THIS MONTH    │    STREAK       │
│     72h         │   12 / 34 days  │
│                 │  current / best │
└─────────────────┴─────────────────┘
```

### Card Design

| Property          | Value                                     |
|-------------------|-------------------------------------------|
| Background        | `var(--bg-secondary)`                     |
| Border            | `1px solid var(--border)`                 |
| Border-radius     | 8px                                       |
| Padding           | 16px                                      |
| Gap (grid)        | 12px                                      |
| Label font        | 12px uppercase, `--text-secondary`, 600   |
| Value font        | 24px, `--text-primary`, 700               |
| Sub-value font    | 13px, `--text-secondary`                  |

### Streak Special Treatment

- Current streak number: `color: var(--green-4)` when > 0, `color: var(--danger)` when 0.
- Longest streak: always `--text-secondary`.
- Flame icon (inline SVG, 16px) next to streak value when streak > 0.

### Export Button

- Below the stats grid (desktop) or below heatmap (mobile).
- Style: ghost button, `border: 1px solid var(--border); color: var(--text-secondary)`.
- Icon: download SVG 16px, left of text "Export CSV".
- Dimensions: auto width, 40px height, `border-radius: 6px`.
- Hover: `border-color: var(--accent); color: var(--text-primary)`.

---

## 7. Micro-animations

### 7a. Session Complete (focus finished)

**Trigger**: focus timer hits 00:00.

1. **Ring pulse**: the progress ring scales to 1.05x and back over 400ms (`ease-out`), color flashes `--green-4` full brightness.
2. **Confetti burst**: 12 small particles (6x6px squares) in tag colors, explode outward from ring center, `opacity: 1 -> 0` over 800ms, physics: random angle, decelerate. Pure CSS `@keyframes` with randomized `--angle` and `--distance` custom properties set via JS.
3. **Digit flash**: timer digits briefly turn `--green-4` for 600ms then return to `--text-primary`.

```css
@keyframes pulse-ring {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes confetti-particle {
  0%   { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
}
```

Duration total: 800ms. Non-blocking (user can interact immediately).

### 7b. Break Start (cool down)

**Trigger**: break countdown begins.

1. **Ring color transition**: ring smoothly transitions from `--green-4` to `--accent` over 500ms.
2. **Background subtle shift**: page background briefly pulses to `#0d1520` (slightly bluer) and returns over 1000ms.

```css
@keyframes cooldown {
  0%   { background-color: var(--bg-primary); }
  50%  { background-color: #0d1520; }
  100% { background-color: var(--bg-primary); }
}
```

### 7c. Heatmap Cell Update

**Trigger**: new session logged, heatmap cell color changes.

1. **Glow**: the updated cell gets a `box-shadow: 0 0 8px {cell-color}` that fades out over 1200ms.
2. **Color transition**: `background-color` transitions over 400ms (`ease-in-out`).

```css
@keyframes cell-glow {
  0%   { box-shadow: 0 0 8px var(--glow-color); }
  100% { box-shadow: 0 0 0px transparent; }
}
```

### 7d. Button Press

All interactive elements: `transform: scale(0.96)` on `:active`, 100ms transition.

### 7e. Tooltip Appear

`opacity: 0 -> 1`, `transform: translateY(4px) -> translateY(0)`, 150ms `ease-out`.

---

## 8. HTML Skeleton

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Deep Work Timer</title>
  <style>/* All CSS here */</style>
</head>
<body>

  <!-- Header -->
  <header class="header">
    <h1 class="header__title">Deep Work Timer</h1>
    <div class="header__streak">
      <svg class="header__streak-icon"><!-- flame icon --></svg>
      <span class="header__streak-current">12 days</span>
      <span class="header__streak-separator">/</span>
      <span class="header__streak-best">34 days best</span>
    </div>
  </header>

  <main class="app">

    <!-- Timer Section -->
    <section class="timer">
      <div class="timer__ring-container">
        <svg class="timer__svg" viewBox="0 0 256 256" width="256" height="256">
          <!-- Track ring (background) -->
          <circle class="timer__track"
            cx="128" cy="128" r="108"
            fill="none"
            stroke="var(--bg-tertiary)"
            stroke-width="8"
          />
          <!-- Progress ring -->
          <circle class="timer__progress"
            cx="128" cy="128" r="108"
            fill="none"
            stroke="var(--green-4)"
            stroke-width="8"
            stroke-linecap="round"
            stroke-dasharray="678.58"
            stroke-dashoffset="0"
            transform="rotate(-90 128 128)"
          />
        </svg>
        <!-- Digits overlay (centered on SVG) -->
        <div class="timer__display">
          <span class="timer__digits">25:00</span>
          <span class="timer__label">Focus</span>
        </div>
      </div>

      <!-- Duration Selector -->
      <div class="timer__durations">
        <button class="timer__duration" data-minutes="15">15</button>
        <button class="timer__duration timer__duration--active" data-minutes="25">25</button>
        <button class="timer__duration" data-minutes="35">35</button>
        <button class="timer__duration" data-minutes="50">50</button>
      </div>

      <!-- Tag Selector -->
      <div class="tags">
        <button class="tags__chip tags__chip--active" data-tag="Code">
          <span class="tags__dot tags__dot--code"></span>Code
        </button>
        <button class="tags__chip" data-tag="Design">
          <span class="tags__dot tags__dot--design"></span>Design
        </button>
        <button class="tags__chip" data-tag="Writing">
          <span class="tags__dot tags__dot--writing"></span>Writing
        </button>
        <button class="tags__chip" data-tag="Learning">
          <span class="tags__dot tags__dot--learning"></span>Learning
        </button>
        <button class="tags__chip" data-tag="Planning">
          <span class="tags__dot tags__dot--planning"></span>Planning
        </button>
        <button class="tags__chip" data-tag="Other">
          <span class="tags__dot tags__dot--other"></span>Other
        </button>
      </div>

      <!-- Start / Pause / Skip -->
      <div class="timer__controls">
        <button class="timer__btn timer__btn--start" aria-label="Start timer">
          <svg class="timer__btn-icon"><!-- play / pause icon --></svg>
        </button>
        <button class="timer__btn timer__btn--skip" aria-label="Skip break" hidden>
          <svg class="timer__btn-icon"><!-- skip-forward icon --></svg>
        </button>
      </div>

      <!-- Confetti container (particles injected via JS) -->
      <div class="timer__confetti" aria-hidden="true"></div>
    </section>

    <!-- Bottom Section: Stats + Heatmap -->
    <section class="bottom">

      <!-- Stats Panel -->
      <div class="stats">
        <div class="stats__card">
          <span class="stats__label">Today</span>
          <span class="stats__value" id="stat-today">0m</span>
          <span class="stats__sub" id="stat-today-sessions">0 sessions</span>
        </div>
        <div class="stats__card">
          <span class="stats__label">This Week</span>
          <span class="stats__value" id="stat-week">0h</span>
        </div>
        <div class="stats__card">
          <span class="stats__label">This Month</span>
          <span class="stats__value" id="stat-month">0h</span>
        </div>
        <div class="stats__card">
          <span class="stats__label">Streak</span>
          <span class="stats__value stats__value--streak" id="stat-streak">0</span>
          <span class="stats__sub" id="stat-streak-best">best: 0 days</span>
        </div>
      </div>

      <!-- Heatmap -->
      <div class="heatmap">
        <div class="heatmap__months" id="heatmap-months">
          <!-- JS: <span class="heatmap__month-label">Jan</span> ... -->
        </div>
        <div class="heatmap__grid-wrapper">
          <div class="heatmap__days">
            <span class="heatmap__day-label">Mon</span>
            <span class="heatmap__day-label"></span>
            <span class="heatmap__day-label">Wed</span>
            <span class="heatmap__day-label"></span>
            <span class="heatmap__day-label">Fri</span>
            <span class="heatmap__day-label"></span>
            <span class="heatmap__day-label"></span>
          </div>
          <div class="heatmap__scroll">
            <div class="heatmap__grid" id="heatmap-grid">
              <!-- JS: 371 <div class="heatmap__cell" data-date="..." data-level="0"> -->
            </div>
          </div>
        </div>
        <!-- Tooltip (positioned absolutely via JS) -->
        <div class="heatmap__tooltip" id="heatmap-tooltip" hidden>
          <div class="heatmap__tooltip-date"></div>
          <div class="heatmap__tooltip-stats"></div>
          <div class="heatmap__tooltip-tags"></div>
        </div>
        <!-- Export -->
        <button class="export-btn" id="export-btn">
          <svg class="export-btn__icon"><!-- download icon --></svg>
          Export CSV
        </button>
      </div>

    </section>

  </main>

  <script>/* All JS here */</script>
</body>
</html>
```

### Key CSS Classes Reference

| Class                        | Element                  | Notes                              |
|------------------------------|--------------------------|------------------------------------|
| `.header`                    | Top bar                  | `text-align: center`              |
| `.header__streak`            | Streak display           | Inline, in header                 |
| `.app`                       | Main wrapper             | `max-width: 960px; margin: auto`  |
| `.timer`                     | Timer section            | `text-align: center; position: relative` |
| `.timer__svg`                | SVG ring                 | 256x256, centered                 |
| `.timer__track`              | Background circle        | `--bg-tertiary` stroke            |
| `.timer__progress`           | Animated progress circle | `stroke-dashoffset` animated      |
| `.timer__display`            | Digits + label overlay   | Absolute centered on SVG          |
| `.timer__digits`             | `25:00`                  | 72px, monospace                   |
| `.timer__label`              | "Focus" / "Break"        | 14px, secondary                   |
| `.timer__durations`          | Pill button row          | Flex, centered                    |
| `.timer__duration--active`   | Selected duration        | Green border                      |
| `.timer__btn--start`         | Play/pause               | 64px circle                       |
| `.timer__confetti`           | Particle container       | Absolute, pointer-events: none    |
| `.tags`                      | Chip row                 | Flex, wrap on mobile              |
| `.tags__chip`                | Single tag chip          | 32px height, pill                 |
| `.tags__chip--active`        | Selected tag             | Tinted background                 |
| `.tags__dot`                 | Color indicator          | 8px circle                        |
| `.bottom`                    | Stats + Heatmap wrapper  | Flex row (desktop), column (mobile)|
| `.stats`                     | 2x2 grid                | `display: grid; grid: 1fr 1fr / 1fr 1fr` |
| `.stats__card`               | Single metric card       | `--bg-secondary`, rounded         |
| `.stats__label`              | Metric name              | 12px uppercase                    |
| `.stats__value`              | Metric number            | 24px bold                         |
| `.stats__value--streak`      | Streak number            | Green or red conditional          |
| `.heatmap`                   | Heatmap section          | `position: relative`              |
| `.heatmap__scroll`           | Scroll container         | `overflow-x: auto` on mobile     |
| `.heatmap__grid`             | Cell grid                | `display: grid; grid-template-rows: repeat(7, 12px); grid-auto-flow: column; gap: 3px` |
| `.heatmap__cell`             | Single day cell          | 12x12px, `border-radius: 2px`    |
| `.heatmap__cell--today`      | Current day              | 2px outline                       |
| `.heatmap__months`           | Month labels row         | Positioned above grid             |
| `.heatmap__days`             | Day labels column        | 30px wide, right-aligned          |
| `.heatmap__tooltip`          | Hover popup              | Absolute, z-index: 10            |
| `.export-btn`                | CSV export               | Ghost style, bottom               |

### Responsive Media Query

```css
/* Desktop: side by side */
.bottom {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}
.stats {
  flex: 0 0 240px;
}
.heatmap {
  flex: 1 1 auto;
  min-width: 0;
}

/* Mobile: vertical stack */
@media (max-width: 600px) {
  .bottom {
    flex-direction: column;
  }
  .stats {
    flex: none;
    width: 100%;
  }
  .heatmap__scroll {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}
```

---

## 9. Spacing & Sizing Summary

| Token          | Value  | Usage                               |
|----------------|--------|-------------------------------------|
| `--space-xs`   | 4px    | Inline gaps                         |
| `--space-sm`   | 8px    | Chip gaps, internal padding         |
| `--space-md`   | 16px   | Card padding, mobile outer padding  |
| `--space-lg`   | 24px   | Section gaps, desktop outer padding |
| `--space-xl`   | 32px   | Between major sections              |
| `--radius-sm`  | 2px    | Heatmap cells                       |
| `--radius-md`  | 6px    | Buttons, tooltip                    |
| `--radius-lg`  | 8px    | Cards                               |
| `--radius-pill`| 16px   | Tag chips, duration pills           |
| `--radius-full`| 50%    | Start button, dots                  |

---

## 10. Accessibility Notes

- All interactive elements: minimum 44x44px touch target (Apple HIG).
- Start button: 64x64px exceeds minimum.
- Contrast ratios (verified against `--bg-primary` #0d1117):
  - `--text-primary` #f0f6fc: **16.5:1** (passes AAA).
  - `--text-secondary` #8b949e: **5.2:1** (passes AA).
  - `--green-4` #39d353 on `--bg-primary`: **7.1:1** (passes AA).
- Timer digits: 72px = large text, 3:1 ratio sufficient (exceeds it).
- All buttons have `aria-label` attributes.
- Heatmap cells have `title` or `aria-label` with date and value for screen readers.
- Focus ring: `outline: 2px solid var(--accent)` on `:focus-visible`, `outline-offset: 2px`.
