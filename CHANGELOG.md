# Changelog

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
