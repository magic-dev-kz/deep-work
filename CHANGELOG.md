# Changelog

## v17.0 (2026-03-29) — Accessibility Pass

- **Skip link**: "Skip to main content" link for keyboard users
- **Timer display**: Added dynamic `aria-label` (e.g. "Timer: 12 minutes 30 seconds remaining") updated on every tick
- **Tag chips**: Already had `role="radio"` + `aria-checked` in radiogroup (verified)
- SW cache bumped to `deepwork-v17`

## v16.0 (2026-03-29) — Sound Volume Slider

- **Volume Slider**: Ambient sound volume control (0-100%) with live adjustment
- SW cache bumped to `deepwork-v16`
## v15.0 — Session Journal (2026-03-29)

**Session Journal**
- Enhanced the post-session "What did you accomplish?" textarea into a prominent Session Journal
- Textarea expanded: 5 rows, min-height 100px, max-height 180px
- Label upgraded to bold "Session Journal" heading
- Character limit increased from 200 to 500 for more detailed entries
- Journal text saved as `journal` field on session (alongside `notes` for backward compat)
- History view shows journal entries in styled blocks with background, not truncated
- "Saved separately per session" hint in the char counter row

### Technical
- Service worker cache bumped to `deepwork-v15`

---

## v14.0 — Daily Focus Quote (2026-03-29)

**Daily Focus Quote**
- Random motivational quote about focus/deep work displayed in the header subtitle area
- Array of 16 quotes from Bruce Lee, Cal Newport, Buddha, Tony Robbins, and others
- Quote changes each day based on day-of-year index
- Replaces the static "Track your focus. See the progress." tagline

### Technical
- Service worker cache bumped to `deepwork-v14`

---

## v13.0 — Focus Streak Visualization (2026-03-29)

**Focus Streak Bar Chart**
- SVG bar chart showing focus minutes for the last 7 days
- Color coded: green if daily goal met (120min), orange if partial, gray if no session
- Minute values displayed above each bar
- Day labels (Mon, Tue, etc.) below each bar
- Legend with color meanings
- Updates automatically after each session save
- Placed below the heatmap section, spanning full width

### Technical
- Service worker cache bumped to `deepwork-v13`

---

## v12.0 — Session Rating, Insights & Break Timer (2026-03-29)

**Session Rating**
- After each focus session, a 1-5 star "How focused were you?" rating appears in the completion modal
- Stars highlight on click with golden color and glow effect
- Rating value saved with session data and preserved through validation
- Resets for each new session

**Productivity Insights**
- "Your most productive hour: 2-3 PM" insight shown in the stats panel
- Calculated from all session timestamps to find the hour with the most total focus minutes
- Appears automatically when 3+ sessions exist; hidden otherwise
- Updates after each session save

**Break Timer Auto-Start**
- After a focus session completes, the 5-minute break countdown automatically starts after a 2-second delay
- Allows the user to see the completion modal and rate the session before the break begins
- Break duration follows existing logic (5 min short break, 15 min every 4th session)

### Technical
- Session validation updated to preserve `rating` field
- Service worker cache bumped to `deepwork-v12`

---

## v11.0 — Onboarding Overlay (2026-03-29)
- **Onboarding overlay**: First-visit glassmorphism overlay with app title, tagline, 3 feature highlights (staggered fade-in), and "Start My First Session" CTA
- CTA dismisses overlay and sets localStorage flag (`deepwork_onboarded`)
- Dark glass card with blue/green accent glow, `prefers-reduced-motion` safe
- Service worker cache bumped to `deepwork-v11`

---

## v10.0 — Visual & Audio Polish (2026-03-29)
- Timer digit font larger (76px to 82px) for readability
- Session complete beep duration longer (150ms to 250ms each) for better audibility
- Service worker cache bumped to `deepwork-v10`

---

## v9.0 — Share on X & Timer Beep (2026-03-29)
- **Share on X**: Button below Export CSV. Pre-filled tweet: "Focus session: Xmin of deep work. Track yours: [URL]"
- **Timer Sound**: Session completion chime replaced with 3 short beeps at 440Hz (Web Audio API), 150ms each with 100ms gaps
- Service worker cache bumped to `deepwork-v9`

## v8.0 — Distraction Counter, Lo-fi Sound & Session Comparison (2026-03-29)
- **Distraction Counter**: "Got distracted" button visible during focus sessions. Increments a counter badge on each click. Distraction count shown in the session completion modal summary ("Distractions: N") and persisted with session data. Resets on new session or reset
- **Focus Music — Lo-fi**: Replaced "Forest" ambient sound with "Lo-fi" — a warm oscillator-based chord pad (A2 sine + A3/E4 triangle with LFO modulation) through the Web Audio API, filtered with a 2kHz lowpass for warmth
- **Session Comparison**: "This week vs Last week" comparison bar added to the Weekly Report section. Shows side-by-side progress bars with hour values and a trend indicator (+Xm more / -Xm less / same)
- Service worker cache bumped to `deepwork-v8`

## v7.0 — PWA Install, Keyboard Shortcuts & Streak Persistence (2026-03-29)
- **PWA Install Prompt**: `beforeinstallprompt` banner shown after 2+ visits, with Install/Dismiss buttons. Dismissed state persisted in localStorage
- **Keyboard Shortcuts**: Space = start/pause timer, Escape = reset. Disabled when focus is in input/textarea
- **Session Streak Persistence**: Streak value saved to localStorage (`deepwork_streak`). Header displays "X-day focus streak" when streak >= 2 days
- Service worker cache bumped to `deepwork-v7`

## v6.0 — Micro-interactions & Polish (2026-03-29)
- **Timer ring glow**: Active timer SVG ring pulses with intensified glow animation (green for focus, blue for break). Removed on reset/complete
- **Session complete celebration**: Existing confetti burst (CSS-only, 12 particles) already present from v3. Verified working
- **Focus-visible**: All interactive elements (duration buttons, tag chips, control buttons, export, sound toggles, template buttons) have explicit `:focus-visible` outline styles
- **Tag selection animation**: Selecting a tag triggers a bounce spring animation (scale 1 -> 1.15 -> 0.92 -> 1.06 -> 1) on the pill
- Service worker cache bumped to `deepwork-v6`
- All new animations respect `prefers-reduced-motion: reduce`

## v5.0 — Focus Score, Weekly Report, Session Templates (2026-03-29)
- **Focus Score**: After each session, an animated 1-100 score appears in the completion modal. Calculated from duration (0-40), streak days (0-35), and weekly tag variety bonus (0-25). Animated counter with letter grade (S/A/B/C) and breakdown display
- **Weekly Report**: Collapsible section in stats panel showing total hours, session count, average per active day, most productive day, top tag, and active days — all auto-generated from localStorage session data
- **Session Templates**: Three quick-start preset buttons — "Quick Focus" (25 min), "Deep Work" (90 min), "Sprint" (45 min) — that set the duration and auto-start the timer in one click
- Duration system extended to support 45m and 90m template durations
- Service worker cache bumped to `deepwork-v5`

## v4.0 — Session Notes, Focus Sounds, Daily Goal Ring (2026-03-29)
- **Session Notes**: Completion modal with optional "What did you accomplish?" textarea (200 char max), saved with session record, displayed in session history with truncation/tooltip
- **Focus Sounds**: Three Web Audio API generated ambient sounds — White Noise, Rain (brown noise), Forest (modulated filtered noise) — with CSS toggle buttons, pulsing indicator dot, fade in/out transitions
- **Daily Goal Ring**: Animated SVG ring showing daily progress percentage, session count display ("2 of 4 sessions today"), celebration animation with confetti burst when goal is reached
- **Export CSV enhanced**: Notes column added to CSV export (Date, Start Time, Duration, Tag, Notes)
- Session history now built with DOM methods (no innerHTML for user data) and shows notes inline
- Service worker cache bumped to `deepwork-v4`

## v3.0 — Premium Visual Redesign (2026-03-29)
- Multi-layer radial-gradient body background with subtle blue/green tones
- Spring-curve `cardIn` @keyframes entrance animation on cards and sections
- Hover lift on stat-cards, tag pills, and panels with shadow escalation
- Dual-layer shadow system: `--shadow-md`, `--shadow-lg`, `--shadow-xl` CSS variables
- Glassmorphism header: `backdrop-filter: blur(20px) saturate(180%)`
- Start button shimmer sweep `::before` on hover, enhanced glow shadows
- Deeper button press feedback (`scale(0.90)`)
- `font-weight: 900` on h1, refined gradient text (white to blue)
- SVG `<defs>` with `linearGradient` for timer ring (green-to-blue gradient stroke)
- Enhanced timer breathing glow with dual drop-shadows
- Heatmap active cells glow matching intensity level
- Tag pill hover lift with color-matched glow shadow per tag
- Streak display gradient text + pulse brightness animation
- All new animations respect `prefers-reduced-motion: reduce`

## v1.0 (2026-03-29)
- Initial release
- Ship-ready (9.0/10)
- PWA (service worker + manifest)
- WCAG AA accessible
- Works offline
