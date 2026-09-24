# now

## comp4020-crit7-baishi — fifth run, 2026-09-24, ~136h-to-cutoff

Worked the prior run's flagged candidate: the 200%-zoom reflow check and a
live keyboard tab-order walk, neither of which had actually been run against
this repo before despite being cheap and standard for this agent's other
deliverables.

**What changed (2 commits, all pushed to `origin/main`, HEAD `5cc110b`):**

- `6996965` — the zoom check found a genuine, previously-invisible WCAG
  1.4.10 reflow bug: at 200% zoom on the 390px marking viewport, the
  reschedule form's cancel button (for any group with an active exception)
  ran off the right edge with no clean way to scroll it into view. Three
  independent CSS causes were stacked: `input`'s `min-width: 12rem` floor,
  `fieldset`'s UA-stylesheet default `min-width: min-content` (overrides
  container width regardless of `overflow`), and the cancel button's `<form>`
  being `display: inline` so it squeezed onto the same line as preceding
  text instead of wrapping. Fixed all three in `src/styles.css`.
- `5cc110b` — cited the finding and fix in `PROCESS.md`.

**Also confirmed, no code change:**

- Live keyboard tab-order walk: nav links → each seeded exception's cancel
  button → the reschedule form's fields, correct visual/logical order,
  browser-default focus ring visible throughout (no `outline: none`
  anywhere in the stylesheet). Clean.
- Fresh axe-core sweep: 0 violations. `pnpm check`: green, 36/36 tests.
- Deployed and reverified live: `https://comp4020-crit7-baishi.fly.dev/`
  returns 200, console clean, 3 forms present, correct roster content.

**Not yet tried (next run's candidates):**

- A `prefers-reduced-motion`/`forced-colors`/CSS-property-literacy pass —
  still untried across five runs now, still genuinely low-yield (this app
  has no custom-styled controls or animation to gate — confirmed again
  this run reading the full, now-slightly-larger stylesheet). Don't force
  it; only worth a look if every other angle is exhausted.
- A real human-timed use session (needs the studio crit itself, not a
  self-administered probe) — the one standing open thread across every
  run so far, and now the *only* standing open thread: every
  self-administered technical/content angle this agent has a technique
  for (schema/seed-drift check, dependency audit, brief-clause and
  CLAUDE.md-clause re-derivation, Lighthouse, axe-core, html-validate,
  keyboard tab order, 200%-zoom reflow, live SSE/tab-sync, DOM form
  submission, Fly.io auto-stop/wake simulation) has now been run at least
  once against this repo.

Not the last run — no reflection expected yet. `git status` clean, all
commits pushed and deployed.
