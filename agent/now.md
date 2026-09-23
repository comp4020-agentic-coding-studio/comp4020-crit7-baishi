# now

## comp4020-crit7-baishi — fourth run, 2026-09-24, ~143h-to-cutoff

Worked the prior run's flagged candidate: the brief-clause-re-derivation
technique in its full form, applied this time to this repo's own `CLAUDE.md`
rules rather than the course source markdown (already checked clause-by-clause
in an earlier run).

**What changed (3 commits, all pushed to `origin/main`, HEAD `9d08e28`):**

- `d81472c` — `CLAUDE.md`'s "one exception per group per week" rule is
  implemented correctly (`addException` deletes any existing exception for
  the same `(critGroupId, week)` before inserting the new one) and
  `README.md` documents it as a deliberate "replace, not stack" decision —
  but nothing in `spec/crit-7.test.ts` had ever posted two reschedules for
  the same group/week and checked which one won. Added that test.
- `0707cf7` — `pnpm audit` still clean (same one correctly-left `esbuild`
  advisory); `pnpm outdated` had one genuine in-range patch (`astro` 7.3.3 →
  7.3.4), applied via `pnpm update`.
- `9d08e28` — cited both in `PROCESS.md`.

**Also found and handled:**

- A genuine new `agent-browser` tooling limitation: `fill`/`click`+`type`
  don't populate `<input type="time">` elements in this sandboxed container
  (confirmed via `eval`-reading `.value` afterward — stayed empty). Worked
  around it by setting `.value` directly via `eval` and dispatching synthetic
  `input`/`change` events, which did work. Logged to `MEMORY.md`.
- Used that workaround to drive the first-ever genuine DOM form submission
  (`requestSubmit()` on the real `<form>`) and a real button `.click()`
  against this app's write path — a distinct verification claim from the
  spec suite's `fetch()` POSTs and from the prior run's tab-to-tab SSE
  check. Both worked cleanly, console clean. Logged as a general technique
  to `MEMORY.md`.
- The local `.data/*.db*` dev database had gone stale from a prior manual
  testing session (missing a seeded exception) and briefly looked like a
  real app bug during the live check above. Traced correctly to gitignored
  local scratch state (unrelated to the deployed Fly volume), deleted and
  regenerated fresh.
- Seed data re-verified against the course website's own published
  `api/crit-groups.json`: still matches verbatim, no drift.
- `pnpm check`: green, 36/36 tests, throughout.

**Deployed:** `flyctl deploy --remote-only --ha=false -a comp4020-crit7-baishi`
succeeded; live URL reverified via `curl` (200, correct seed data) and
`agent-browser` (console clean) against
`https://comp4020-crit7-baishi.fly.dev/`.

**Not yet tried (next run's candidates):**

- A `prefers-reduced-motion`/`forced-colors`/CSS-property-literacy pass —
  still untried across four runs now, still likely genuinely low-yield
  (confirmed by reading `src/styles.css` in full this run: no custom
  `appearance`/background-shaped controls, no animation anywhere to gate).
  Worth one real look if every other angle is exhausted, but don't force it.
- A real human-timed use session (needs the studio crit itself, not a
  self-administered probe) — the one standing open thread across every run
  so far.
- The 200%-zoom reflow check and a live keyboard tab-order walk haven't
  actually been run against this repo yet (unlike most of this agent's other
  deliverables) — worth doing at least once, low cost given the app is
  almost entirely native form controls.

Not the last run — no reflection expected yet. `git status` clean, all
commits pushed and deployed.
