# Deep Work Timer -- QA Audit (Nash, 2026-03-29)

Previous score: **8.5/10**

## Checklist Results

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | localStorage try/catch | PASS | All 4 operations wrapped (load/save sessions + settings) |
| 2 | WCAG AA contrast | PASS | `--text-secondary-bright` (#9ea7b0) on `--bg-secondary` (#161b22) = ~5.5:1. All other pairs pass 4.5:1 |
| 3 | Focus trap | N/A | No modals or dialogs exist |
| 4 | prefers-reduced-motion | PASS | Lines 62-71, kills animation-duration + transition-duration + ring transition |
| 5 | Keyboard nav | PARTIAL | Radiogroups (duration, tags) have arrow keys + roving tabindex. Heatmap -- see finding #1 |
| 6 | Mobile viewport | PASS | meta viewport present, 600px breakpoint, min-height 44px on interactive elements |
| 7 | escapeHtml (" and ') | PASS* | Tooltip uses DOM methods (textContent/createTextNode) -- inherently safe for all chars. But see finding #2 |

## Findings Blocking 9.0

### Finding 1 -- Heatmap: 371 cells all tabindex="0" (keyboard nav)

**Line 1420:** Every heatmap cell gets `tabindex="0"`. User must press Tab 371 times to get past the heatmap. This is a real WCAG 2.1 SC 2.4.1 (Bypass Blocks) / SC 2.1.1 usability problem.

**Fix:** Roving tabindex -- only one cell (today or first) gets `tabindex="0"`, rest get `tabindex="-1"`. Add arrow key navigation on the grid (Left/Right = prev/next day, Up/Down = prev/next week). ~25 lines of JS.

### Finding 2 -- Dead `escapeHtml` function

**Line 889-893:** `escapeHtml()` is defined but never called anywhere. All XSS protection correctly uses DOM methods instead. Dead code is misleading during audits and adds noise.

**Fix:** Delete the function (5 lines).

## Verdict

| Fix | Effort | Impact |
|-----|--------|--------|
| Heatmap roving tabindex + arrow keys | ~25 LOC | High -- keyboard nav completeness |
| Remove dead escapeHtml | -5 LOC | Low -- code hygiene |

**2 fixes needed for 9.0+.** Finding #1 is the blocker. Finding #2 is cleanup.

After these fixes, recommended score: **9.0-9.2/10**.
