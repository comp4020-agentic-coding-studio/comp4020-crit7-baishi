# now

## comp4020-crit7-baishi — sixth run, 2026-09-24, ~130h-to-cutoff

The prior run's own `now.md` had flagged the human-timed studio session as
the *only* standing open thread — every self-administered technique this
agent has had been run at least once. Rather than force a low-yield
CSS-property-literacy pass on a stylesheet with no custom controls, tried a
genuinely new interaction instead: drove two real `agent-browser` tabs
through the exact "more than one tutor has this open" scenario `README.md`
names as the whole reason live sync exists, rather than just the redirect
and SSE-stream contracts already covered by `spec/crit-7.test.ts`.

**What changed (2 commits, pushed to `origin/main`, HEAD `e403687`):**

- `e3a4a3d` — found and fixed a real data-loss bug: typing a draft reason
  into the reschedule form in tab 1, then submitting an unrelated reschedule
  from tab 2, showed tab 1's SSE-triggered `location.reload()` fire
  unconditionally and silently wipe the draft, with no warning. Fixed with
  `createDirtyTracker` in `src/lib/live-reload.ts`, wired to the reschedule
  form's own `input` event (`src/pages/index.astro`) and checked before
  every reload site (the plain `"message"` case and the
  post-first-reconnect case both) — a reload that would otherwise fire now
  shows a small `#stale-notice` status message instead. Added
  `spec/crit-7.test.ts` coverage for the tracker itself (36 → 38 tests) and
  a `.notice` style in `src/styles.css`.
- `e403687` — cited the finding and fix in `PROCESS.md` and `README.md`'s
  "Decisions this run made and why" list.

**Verification, this run:**

- Confirmed the bug was real (not a false negative) via distinguishing JS
  markers across three tabs: a dirty tab shows the notice and keeps its
  draft; a clean tab still reloads normally on the same change (no
  regression). Hit and worked around a known `type="time"` fill limitation
  along the way (see `MEMORY.md`) that had produced an initial false
  negative.
- `pnpm check` green (38/38) throughout; fresh axe-core sweep 0 violations;
  console clean across all three tabs.
- Deployed (`flyctl deploy --remote-only --ha=false -a
  comp4020-crit7-baishi`) and reverified live:
  `https://comp4020-crit7-baishi.fly.dev/` returns 200, console clean, the
  reschedule form and `#stale-notice` (correctly `hidden` by default) are
  both present in the live DOM.

**Next run's candidates:**

- No new self-administered technical/content angle is currently flagged —
  this is the expected steady state for a repo this thoroughly worked (same
  pattern as crit-4/crit-5 late runs), not a sign something's being missed.
  If a future run wants to try anyway: re-read `src/lib/live-reload.ts`'s
  own comments clause-by-clause (the technique that found real bugs
  repeatedly on Drift/Two-Tone) — e.g. does the dirty flag itself ever need
  clearing (right now it's set-once-per-page-load with no way back to
  clean; a tutor who abandons their draft and reloads manually gets a fresh
  tracker for free, so this may already be fine, but hasn't been explicitly
  checked).
- The human-timed studio-crit session remains the only *structural* open
  thread — needs the studio itself, not a future run of this agent.

Not the last run — no reflection expected yet. `git status` clean, all
commits pushed and deployed.
