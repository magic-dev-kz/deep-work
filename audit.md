# Deep Work Timer -- QA Audit Report

**Auditor:** Nash, QA @ OpenClaw
**Date:** 2026-03-29
**Version:** index.html (single file, ~1298 lines)
**Spec:** spec.md v1.0, design.md v1.0

---

## Overall Score: 6.5 / 10

Solid foundation, timer logic is correct, localStorage is properly wrapped. But significant deviations from design.md, missing animations, XSS vector in tooltip, and several edge cases that will break in production.

---

## 1. House Checklist

### 1.1 localStorage/sessionStorage -- try/catch

**PASS.** All four storage functions are wrapped:

- `loadSessions()` (line 696-701): try/catch, returns `[]` on error
- `saveSessions()` (line 704-713): try/catch, sets `storageWarning` on quota exceeded
- `loadSettings()` (line 715-721): try/catch, returns defaults on error
- `saveSettings()` (line 724-729): try/catch, silently ignores error

No raw `localStorage` calls outside these helpers. Clean.

### 1.2 WCAG AA Contrast

**PARTIAL FAIL.** Detailed contrast analysis against `--bg-primary: #0d1117`:

| Text | Color | Background | Ratio | WCAG AA | Verdict |
|------|-------|------------|-------|---------|---------|
| Headings, digits | `#f0f6fc` | `#0d1117` | 15.97:1 | 4.5:1 (normal) | PASS |
| Labels, captions | `#8b949e` | `#0d1117` | 4.98:1 | 4.5:1 (normal) | PASS (barely) |
| Stat labels (12px uppercase) | `#8b949e` | `#0d1117` (via `--bg-primary` card bg) | 4.98:1 | 4.5:1 | PASS |
| Stat labels inside stat-card | `#8b949e` | `#0d1117` (`--bg-primary`) | 4.98:1 | 4.5:1 | PASS |
| Month/day labels (11px) | `#8b949e` | `#161b22` (`--bg-secondary`) | 3.97:1 | 4.5:1 (normal) | **FAIL** |
| Heatmap section h2 | `#f0f6fc` | `#161b22` | 12.74:1 | 4.5:1 | PASS |
| Export btn text | `#8b949e` | `#0d1117` (`--bg-primary`) | 4.98:1 | 4.5:1 | PASS |
| Tooltip text | `#f0f6fc` | `#21262d` (`--bg-tertiary`) | 10.26:1 | 4.5:1 | PASS |
| Storage warning | `#d29922` | `#3d1f00` | ~4.7:1 | 4.5:1 | PASS (barely) |
| Header subtitle (14px) | `#8b949e` | `#0d1117` | 4.98:1 | 4.5:1 | PASS |
| Tag chip inactive text | `#8b949e` | `#161b22` (`--bg-secondary`) | 3.97:1 | 4.5:1 | **FAIL** |
| Duration btn inactive | `#8b949e` | `#161b22` (`--bg-secondary`) | 3.97:1 | 4.5:1 | **FAIL** |

**BUG-01 [P2]: Month labels, day labels, inactive tag chips, and inactive duration buttons all render `#8b949e` on `#161b22` (ratio ~3.97:1), which FAILS WCAG AA for normal text (requires 4.5:1).** These elements have small font sizes (11-14px) so the large-text exception (3:1) does not apply.

### 1.3 Focus trap in modals/overlay

**N/A.** No modals or overlays exist. The tooltip has `pointer-events: none` (line 473), so it cannot trap focus. Clean.

### 1.4 prefers-reduced-motion

**PASS.** Lines 56-65:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .timer-ring-progress {
    transition: none !important;
  }
}
```
Covers all animations and transitions. Correct implementation.

### 1.5 Keyboard navigation

**PARTIAL FAIL.**

- All buttons are native `<button>` elements: keyboard accessible by default. PASS.
- Duration selector uses `role="radiogroup"` with `role="radio"` on buttons (lines 545-549): correct ARIA, but **missing arrow key navigation**. Radio groups should support Left/Right arrow keys per WAI-ARIA spec. Users can only Tab between them. **BUG-02 [P3].**
- Tag selector: same issue -- `role="radiogroup"` without arrow key handlers. **Same bug.**
- Heatmap cells have `cursor: pointer` but no `tabindex` -- they are `<div>` elements, not focusable via keyboard. **BUG-03 [P3]: Heatmap cells are not keyboard-accessible. Cannot reach tooltip via keyboard.**

### 1.6 Offline

**PASS.** No external resources: no CDN fonts, no external CSS/JS, no network requests. System font stack (line 33). Inline SVG icons. Web Audio API is local. Works from `file://` protocol. No service worker, but none needed for a single-file app.

### 1.7 Mobile viewport

**PASS.** Line 5: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`. Responsive breakpoint at 600px (line 503). Heatmap has `overflow-x: auto` (line 403). Min-height 44px on buttons. Flex-wrap on tag chips. Timer shrinks to 240px on mobile (line 523-528).

---

## 2. Acceptance Criteria -- 10 AC

### AC-1: Timer accuracy (Date.now() delta, not setInterval counting)

**PASS.**

- `startTimer()` (line 823): `state.endTime = Date.now() + durationSec * 1000`
- `tick()` (line 853): `var remaining = (state.endTime - Date.now()) / 1000`
- Uses `Date.now()` delta, not counter increment. Drift is bounded by display refresh only.
- Interval at 100ms (line 849) for smooth updates.

### AC-2: Focus duration options (15, 25, 35, 50) + breaks (5/15, long every 4th)

**PASS.**

- `FOCUS_DURATIONS = [15, 25, 35, 50]` (line 649)
- `SHORT_BREAK = 5; LONG_BREAK = 15; LONG_BREAK_INTERVAL = 4` (lines 650-652)
- Duration buttons in HTML (lines 547-549): 15m, 25m, 35m, 50m
- Long break logic (line 812): `state.sessionsCompleted % LONG_BREAK_INTERVAL === 0 ? LONG_BREAK : SHORT_BREAK`

**BUT:** Default button has `active` class on 15m (line 547: `data-duration="15"` has class `active`), while `aria-checked="true"` is on the 25m button (line 548). **BUG-04 [P2]: Visual state and ARIA state are out of sync on initial load. The CSS class `active` is on 15m but `aria-checked="true"` is on 25m.** However, the JS `updateDurationUI()` is called at line 736 and will correct this immediately based on `state.focusDuration = 25`. So the HTML mismatch is cosmetic and fixed by JS on load. Downgrading to **P3** -- the raw HTML is wrong but JS fixes it immediately.

### AC-3: Heatmap rendering (371 cells, 12x12px, 3px gap, 53 cols x 7 rows)

**PASS.**

- Lines 1063: `for (var i = 0; i < 371; i++)` -- exactly 371 cells
- CSS grid (lines 441-447): `grid-template-rows: repeat(7, 12px); grid-auto-flow: column; grid-auto-columns: 12px; gap: 3px`
- Cell size (lines 449-450): `width: 12px; height: 12px`
- Day labels: Mon, Wed, Fri (lines 597-602) -- matches spec
- Month labels rendered dynamically (line 1084-1112)

Total width: 53 * (12 + 3) - 3 = 792px. Correct per spec.

### AC-4: Data persistence (localStorage, key, format, quota handling)

**PASS.**

- Key: `deepwork_sessions` (line 647)
- Format: `{ts: number, duration: number, tag: string}` (lines 872-876)
- Quota handling: `saveSessions()` catches error, shows `storageWarning` banner (lines 704-713)
- Warning banner (line 539): `role="alert"` for accessibility
- Timer continues functioning even if storage fails (`state.storageError` flag, but timer logic does not depend on it)

### AC-5: Session tagging (6 tags, selected before starting, default "Code")

**PASS.**

- `TAGS = ['Code', 'Design', 'Writing', 'Learning', 'Planning', 'Other']` (line 653)
- Default: 'Code' (line 659, line 718)
- Tag locked during focus (line 764): `if (state.isRunning && !state.isBreak) return`
- Tag selector disabled during focus (lines 965-973)
- Tag stored in session (line 876): `tag: state.selectedTag`

### AC-6: Statistics panel (4 metrics, real-time update)

**PASS.**

- Today: minutes + session count (lines 1187-1196)
- This week Mon-Sun (lines 1198-1210): correct Monday calculation using `dow === 0 ? 6 : dow - 1`
- This month (lines 1212-1219)
- Streak current + longest (lines 1221-1257)
- Updated after each session via `updateStats()` call at line 880

### AC-7: Touch targets and accessibility (44px min, 64px start, WCAG AA, 72px digits, 16px stats)

**PARTIAL FAIL.**

- Start button: 72x72px (line 274-275) -- exceeds 64px minimum. PASS.
- Duration buttons: `min-height: 44px` (line 118). PASS.
- Tag chips: `min-height: 44px` (line 154). PASS.
- Reset/Skip buttons: 48x48px (line 289). PASS.
- Export button: `min-height: 44px` (line 365). PASS.
- Timer digits: 72px (line 236). PASS. Drops to 60px on mobile (line 517) -- **BUG-05 [P3]: Spec says 72px minimum. Mobile override sets 60px. Violates AC-7 literally, though 60px is still large text.**
- Stats value font: 20px (line 349). Spec says 16px minimum for stats. PASS.
- Stat label: 12px (line 339). Below spec's 16px minimum? Spec says "Font size for stats: 16px minimum" which is ambiguous -- could mean values only. **BUG-06 [P3]: Stat labels are 12px, sub-text is 13px. If spec means all stat text >= 16px, these fail.**
- WCAG AA: see section 1.2 above. PARTIAL FAIL due to contrast issues.

### AC-8: Notification on session end (Web Audio chime 800-1200ms + browser Notification)

**PASS.**

- Chime (lines 976-1004): Three-tone C5-E5-G5, starts at 0ms, last tone ends at 0.4+0.5=0.9s = 900ms total. Within 800-1200ms spec. Web Audio API, no external files.
- Notification (lines 1008-1018): checks permission, fires with correct text strings matching spec exactly.
- Graceful degradation: if no Notification API, returns early (line 1009). If denied, skips (line 1010-1011). Chime still plays regardless.

### AC-9: Data export (CSV, columns, filename, ISO 8601)

**PARTIAL FAIL.**

- Columns: `date,start_time,duration_minutes,tag` (line 1263). Matches spec. PASS.
- Filename: `deepwork_export_YYYY-MM-DD.csv` (line 1277). PASS.
- Header row included. PASS.
- ISO 8601 dates: `YYYY-MM-DD` for date column, `YYYY-MM-DDTHH:MM:SS` for start_time. PASS.
- **BUG-07 [P2]: CSV does not escape special characters.** If a user could modify localStorage and inject a tag containing commas or quotes, the CSV would be malformed. However, since tags are from a preset list, this is low-risk. But `s.tag` is read directly from parsed JSON without validation (line 1273). If localStorage is corrupted with a tag like `"Code,\"evil"`, the CSV breaks. Also no BOM for Excel UTF-8 compatibility.
- **BUG-08 [P3]: No data validation on export.** If `s.ts` is NaN or `s.duration` is undefined, the CSV row will contain `NaN` or `undefined`. No defensive coding.

### AC-10: Responsive layout (600px breakpoint, stack on mobile)

**PASS.**

- Breakpoint at 600px (line 503)
- Desktop: `grid-template-columns: 1fr 280px` (line 307) -- heatmap + stats side by side. PASS.
- Mobile: `grid-template-columns: 1fr` (line 504), stats `order: 1`, heatmap `order: 2`. PASS.
- Heatmap wrapper: `overflow-x: auto` (line 403). PASS.

**BUT:** design.md specifies stats panel at 240px fixed width (line 107 of design.md), code has it at 280px (line 307 of index.html). **BUG-09 [P3]: Stats panel width 280px vs design spec 240px.**

Also design.md says layout order on mobile is "timer, stats, heatmap" which matches the code (`order: 1` for stats, `order: 2` for heatmap). But the Export button is inside `.stats-panel` (line 632), while design.md places it "below heatmap" on mobile. **BUG-10 [P3]: Export button position differs from design spec on mobile.**

---

## 3. Edge Cases

### 3.1 Timer in background tab (requestAnimationFrame freeze)

**NOT VULNERABLE.** Timer uses `setInterval` (line 849) with `Date.now()` delta (line 853), NOT `requestAnimationFrame`. `setInterval` in background tabs is throttled to ~1s in modern browsers but NOT stopped. And since the remaining time is calculated from `Date.now()` absolute difference, not from tick counting, the timer will show correct time when the tab is re-focused. The display just updates less frequently in background. On completion, the `remaining <= 0` check (line 854) fires correctly.

**Minor issue:** The chime and notification will fire when the background interval ticks past zero, which may be delayed by up to 1 second. Acceptable.

### 3.2 System clock change

**VULNERABLE. BUG-11 [P2].** The timer uses `state.endTime = Date.now() + durationSec * 1000` (line 823). If the user sets their system clock forward by 25 minutes during a focus session, `Date.now()` will jump forward, `remaining` will become negative, and the session will complete instantly. If set backward, the timer will appear to gain extra time. There is no `performance.now()` cross-check. This is a known limitation of `Date.now()`-based timers, acknowledged but not fixable without `performance.now()` (which doesn't survive tab sleep).

### 3.3 Heatmap with 1000+ sessions -- performance

**POTENTIAL ISSUE. BUG-12 [P3].** `renderHeatmap()` calls `loadSessions()` which parses ALL sessions from localStorage every time. With 1000 sessions, this is a ~50KB JSON parse. Then iterates all sessions to build `dayMap` (line 1035-1042). Then creates 371 DOM elements with `document.createElement` + `appendChild` individually (no document fragment). Also `innerHTML = ''` on grid (line 1059) to clear old cells.

With 10,000 sessions (heavy user over 2 years), the JSON parse + iteration becomes noticeable. However, 371 DOM elements is constant and small. **Recommendation:** Use `DocumentFragment` for batch DOM insertion. Consider caching `dayMap` instead of rebuilding from all sessions every render.

Also: `updateStats()` iterates ALL sessions four times (today, week, month, streaks) -- lines 1188, 1206, 1215, 1223. With 10K sessions this is 40K iterations per update. Should pre-compute or index.

### 3.4 Heatmap 371 cells -- correct dates?

**PASS with caveat.** Logic (lines 1044-1057):
1. Gets today, sets to midnight
2. Finds end of week (Saturday) by adding `6 - todayDow` days
3. Goes back 370 days from that Saturday for start

This gives 371 cells. The grid uses `grid-auto-flow: column` with 7 rows, so columns fill Sunday-Saturday vertically. **However:** The start day is calculated from the Saturday end, going back 370 days. If today is Sunday (dow=0), endOffset = 6, meaning the grid extends 6 days into the future. This is intentional (matching GitHub's behavior of showing full weeks), but cells for future dates will always show 0.

**BUG-13 [P3]: No visual distinction for future dates.** GitHub dims future cells. Here they look the same as "0 sessions" past cells.

### 3.5 Streak calculation on day boundary / timezones

**VULNERABLE. BUG-14 [P2].** Streak uses `dateKey()` which calls `d.getFullYear()`, `d.getMonth()`, `d.getDate()` -- all local timezone. A user who works past midnight will have their session split across two calendar days depending on when `state.sessionStartTs = Date.now()` fires (line 819). The session timestamp is the START time, so a 50-minute session starting at 23:30 will be recorded on the previous day, not the day it ends.

More critically: `dateKey()` is timezone-dependent. If a user travels across timezones (Moscow -> London), their stored timestamps will be interpreted differently, potentially creating gaps or overlaps in the streak. Sessions stored with Moscow midnight will map to different dates in London time.

This is fundamentally unfixable without storing timezone info per session or using UTC consistently. Current behavior is "use local time" which is the least-surprising default.

### 3.6 Tags -- color distinguishability

**BUG-15 [P2]: Planning (#e3b341) and Writing (#d29922) are both yellow/amber.** On the heatmap tooltip, these 8px dots will be very hard to distinguish. Contrast between them is only about 1.3:1.

Also: design.md specifies `--tag-code: #39d353` but code has `--tag-code: #3fb950` (line 27). **BUG-16 [P3]: Tag color for Code differs from design spec** (#3fb950 vs #39d353).

Similarly: design.md specifies `--tag-other: #484f58` but code has `--tag-other: #8b949e` (line 32). **BUG-17 [P3]: Tag color for Other differs from design spec** (#8b949e vs #484f58).

### 3.7 CSV export -- special characters

See BUG-07 above. Tags are from a preset list so injection is unlikely, but corrupted localStorage could inject arbitrary strings into the tag field. No CSV escaping (no quoting of fields containing commas/quotes/newlines).

### 3.8 Audio -- Web Audio API chime

**PASS.** Wrapped in try/catch (line 977-1004). Creates new AudioContext per chime, closes after 1.5s timeout (line 1001). Three sine wave tones, pleasant C-E-G major chord. Duration: ~900ms, within spec's 800-1200ms range.

**Minor:** Creating a new AudioContext per chime may hit browser limits (Chrome warns after 6+ contexts). Should reuse a single context. **BUG-18 [P3].**

### 3.9 Notifications -- permission denied

**PASS.** Line 1010-1011: if `permission === 'granted'`, show. If `!== 'denied'`, request. If denied, silently skips. Chime plays regardless of notification state (separate function calls at lines 883-884). Graceful degradation confirmed.

### 3.10 localStorage corrupted

**PARTIAL PASS.** `loadSessions()` catches JSON parse errors (line 699) and returns `[]`. But if the JSON is valid but contains wrong data types (e.g., `ts: "not_a_number"`), the code does NOT validate session objects. `new Date("not_a_number")` returns Invalid Date, `dateKey()` would return `NaN-NaN-NaN`, and the heatmap/stats would silently malfunction without any user-visible error. **BUG-19 [P2]: No schema validation on loaded sessions. Corrupted but valid JSON will cause silent failures throughout the app.**

---

## 4. Code Quality

### 4.1 Global variables

**PASS.** Everything is inside an IIFE (line 643): `(function() { 'use strict'; ... })();`. The `$` helper and all state are local. No window pollution.

### 4.2 IIFE + strict mode

**PASS.** Line 643-644: `(function() { 'use strict';`. Correct.

### 4.3 Memory leaks -- setInterval

**PASS.** `setInterval` (line 849) is always cleared:
- On timer complete: `clearInterval(state.intervalId)` (line 856)
- On pause: `clearInterval(state.intervalId)` (line 836)
- On reset: `clearInterval(state.intervalId)` (line 919)
- On skip: `clearInterval(state.intervalId)` (line 943)

All paths set `state.intervalId = null` after clearing. No orphaned intervals.

**However:** AudioContext objects are created per chime and closed via setTimeout. If `playChime()` is called rapidly (e.g., skip button spam completing sessions), multiple AudioContexts could pile up before their 1.5s cleanup. Low-risk but present.

### 4.4 Dead code

**PASS.** No unused functions or unreachable code found. All defined functions are called. The `cursor` variable in `renderMonthLabels` (line 1090) is declared but never used after initialization. **BUG-20 [P4]: Dead variable `cursor` in `renderMonthLabels()` (line 1090).**

### 4.5 XSS via tooltip or user content

**BUG-21 [P1]: XSS via tooltip innerHTML.** Line 1166: `tooltip.innerHTML = html;` where `html` includes `formatDateLabel(d)` and tag names from `JSON.parse(cell.dataset.tags)`. The tag names come from `cell.dataset.tags` which is set at line 1074: `cell.dataset.tags = JSON.stringify(info.tags)`. The tags originate from session data in localStorage.

If an attacker (or a browser extension, or the user themselves via DevTools) modifies localStorage to include a tag like `<img src=x onerror=alert(1)>`, this would execute JavaScript when hovering over the heatmap cell. The tag name is inserted into HTML without escaping at line 1162.

Similarly, `formatDateLabel()` is safe (uses month array + getDate() + getFullYear() which produce numbers and fixed strings), but the tag injection path is real.

**Fix:** Use `textContent` instead of `innerHTML`, or HTML-escape all dynamic values.

---

## 5. Design Conformance

### 5.1 Timer SVG dimensions

**DEVIATION.** Design spec: 256x256px SVG, radius 108, circumference 678.58. Code: 280x280px SVG (line 564), radius 124 (line 565), circumference 2*PI*124 = 779.11. **BUG-22 [P3]: Timer ring dimensions differ from design spec (280px vs 256px, r=124 vs r=108).**

The ring math in code is internally consistent: `RING_CIRCUMFERENCE = 2 * Math.PI * 124 = 779.11` (line 690). `strokeDasharray` is set to this value (line 691). `updateRing()` calculates offset correctly as `RING_CIRCUMFERENCE * fraction` (line 789). **The math is correct for the implemented dimensions, just not matching design spec.**

### 5.2 Progress ring color

**DEVIATION.** Design says: focus ring = `--green-4`, break ring = `--accent`. Code: focus ring = `--accent` (line 203, default stroke color), break ring = `--tag-planning` (line 224: `.is-break { stroke: var(--tag-planning); }`). **BUG-23 [P2]: Ring colors are inverted/wrong vs design spec. Focus should be green, break should be blue. Code has focus as blue, break as yellow.**

### 5.3 Start button style

**DEVIATION.** Design says: default play button `background: var(--green-4)` (green). Code: `background: var(--bg-secondary)` (dark grey, line 258). Running state: code uses `--danger` red (line 279), design says `--bg-tertiary` grey. **BUG-24 [P3]: Start button colors differ from design spec.**

### 5.4 Missing animations from design.md

**BUG-25 [P3]: Multiple animations specified in design.md section 7 are not implemented:**
- 7a: Confetti burst on session complete -- **MISSING**. No confetti container, no particle generation code.
- 7a: Digit flash to green on complete -- **MISSING**.
- 7b: Background subtle blue shift on break start -- **MISSING**.
- 7c: Heatmap cell glow on update -- **MISSING**.
- 7d: Button press scale(0.96) on :active -- **MISSING**.
- 7e: Tooltip translateY animation -- **MISSING** (only opacity transition exists, line 476).

Only the ring pulse animation is implemented (lines 213-221), and it differs from spec (opacity pulse vs scale pulse).

### 5.5 Today's cell outline

**BUG-26 [P3]: Design spec requires today's heatmap cell to have `outline: 2px solid var(--text-secondary)` for visual anchor. Not implemented.** No `.heatmap-cell--today` class exists.

### 5.6 Streak in header

**DEVIATION.** Design spec shows streak in header (lines 413-419 of design.md). Code places streak only in stats panel. **BUG-27 [P3]: No streak display in header as specified in design.md.**

### 5.7 Streak color treatment

**BUG-28 [P3]: Design spec says streak value should be `--green-4` when > 0, `--danger` when 0. Also a flame icon when > 0. Not implemented.** Streak value always uses `--text-primary`.

### 5.8 Timer digits font

**DEVIATION.** Design says `--font-mono` (monospace). Code uses inherited `--font-stack` (sans-serif) via body font-family. The digits have `font-variant-numeric: tabular-nums` (line 238) which helps with alignment but is not the same as monospace. **BUG-29 [P3].**

### 5.9 Layout structure

**DEVIATION.** Design spec: stats LEFT, heatmap RIGHT (see ASCII diagram lines 93-99 of design.md). Code: heatmap LEFT (`1fr`), stats RIGHT (`280px`) in `grid-template-columns: 1fr 280px` (line 307). **BUG-30 [P3]: Stats and heatmap positions are swapped vs design spec.**

### 5.10 Tooltip border

**MISSING.** Design spec: `border: 1px solid var(--border)`. Code tooltip has no border (lines 466-478). **Minor, covered under BUG-25.**

---

## 6. Bug Summary

| ID | Priority | Category | Description |
|----|----------|----------|-------------|
| BUG-01 | P2 | A11y | WCAG AA contrast fail for `#8b949e` on `#161b22` (month labels, inactive buttons/chips). Ratio 3.97:1, needs 4.5:1. |
| BUG-02 | P3 | A11y | Radio groups (duration, tags) lack arrow key navigation per WAI-ARIA pattern. |
| BUG-03 | P3 | A11y | Heatmap cells not keyboard-accessible (no tabindex on divs). |
| BUG-04 | P3 | HTML | Initial HTML has `active` class on 15m button but `aria-checked="true"` on 25m. Fixed by JS on load. |
| BUG-05 | P3 | Spec | Timer digits drop to 60px on mobile, spec says 72px minimum. |
| BUG-06 | P3 | Spec | Stat labels 12px, stat sub 13px -- potentially below spec's 16px minimum. |
| BUG-07 | P2 | Data | CSV export does not escape special characters. Corrupted localStorage could produce malformed CSV. |
| BUG-08 | P3 | Data | No validation on session data during export. NaN/undefined values possible. |
| BUG-09 | P3 | Design | Stats panel 280px vs design spec 240px. |
| BUG-10 | P3 | Design | Export button inside stats panel, design spec places it below heatmap on mobile. |
| BUG-11 | P2 | Timer | System clock manipulation can skip or extend timer (Date.now() only). |
| BUG-12 | P3 | Perf | No DocumentFragment for heatmap rendering. Repeated full-array iteration in updateStats(). |
| BUG-13 | P3 | UX | Future dates in heatmap not visually distinguished from empty past dates. |
| BUG-14 | P2 | Logic | Streak calculation is timezone-dependent. Travel across timezones can break streaks. |
| BUG-15 | P2 | Design | Planning and Writing tag colors too similar (#e3b341 vs #d29922). |
| BUG-16 | P3 | Design | --tag-code is #3fb950, design spec says #39d353. |
| BUG-17 | P3 | Design | --tag-other is #8b949e, design spec says #484f58. |
| BUG-18 | P3 | Audio | New AudioContext created per chime. Risk of browser context limit warnings. |
| BUG-19 | P2 | Data | No schema validation on loaded sessions. Corrupted JSON causes silent failures. |
| BUG-20 | P4 | Code | Dead variable `cursor` in renderMonthLabels(). |
| BUG-21 | **P1** | **Security** | **XSS via tooltip innerHTML. Malicious tag names in localStorage execute as HTML.** |
| BUG-22 | P3 | Design | Timer SVG 280px/r=124 vs design spec 256px/r=108. |
| BUG-23 | P2 | Design | Ring colors inverted: focus=blue (should be green), break=yellow (should be blue). |
| BUG-24 | P3 | Design | Start button background differs from design spec. |
| BUG-25 | P3 | Design | 6 of 7 animations from design.md not implemented (confetti, digit flash, bg shift, cell glow, button scale, tooltip translateY). |
| BUG-26 | P3 | Design | Today's cell missing outline highlight. |
| BUG-27 | P3 | Design | Streak not shown in header per design spec. |
| BUG-28 | P3 | Design | Streak value not color-coded (green/red) per design spec. No flame icon. |
| BUG-29 | P3 | Design | Timer digits use sans-serif, design spec says monospace. |
| BUG-30 | P3 | Design | Stats and heatmap positions swapped (stats right, should be left). |

---

## 7. Priority Breakdown

- **P1 (must fix before ship):** 1 bug (XSS)
- **P2 (fix in v1.0):** 7 bugs (contrast, CSV, clock, timezone, tag colors, ring colors, data validation)
- **P3 (fix in v1.1):** 21 bugs (mostly design deviations and minor a11y)
- **P4 (nice to have):** 1 bug (dead variable)

---

## 8. Verdict

The timer core is well-engineered: Date.now()-based accuracy, proper setInterval cleanup, try/catch on all storage, IIFE+strict, and zero external dependencies. The developer clearly knows what they are doing with the functional parts.

The critical miss is **BUG-21 (XSS via innerHTML)** -- a one-line fix (`textContent` or escaping) but a real vulnerability.

The biggest quality gap is **design conformance**: the code diverges from design.md in colors, dimensions, layout order, and animations. If design.md is the source of truth, roughly 40% of visual specs are not met.

**Recommendation:** Fix BUG-21 immediately. Then address P2 contrast and ring color issues. Design alignment can follow iteratively.

**Score: 6.5/10** -- strong engine, weak paint job, one security hole.
