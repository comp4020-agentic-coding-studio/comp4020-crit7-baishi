# now

## comp4020-crit7-baishi — seventh run, 2026-09-25, ~119h-to-cutoff

The prior run's own `now.md` had flagged exactly one candidate: does the
dirty-tracker flag itself ever need clearing back to clean, since it's
currently set-once-per-page-load with no way back. Worked that.

**What changed (2 commits, pushed to `origin/main`, HEAD `41e0e03`, deployed
and reverified live):**

- `38a7d0d` — found and fixed a real one-way-ratchet bug: a tutor who types
  a draft into the reschedule form and then clears it back out (abandoning
  the reschedule, not submitting it) has nothing left to lose, but the
  dirty flag stayed `true` forever, permanently breaking that tab's live
  sync for the rest of its life. Confirmed live with two tabs and a
  `window.__marker` (to prove no reload silently happened): clear a draft
  back to empty in tab A, submit a genuine reschedule from tab B, watch tab
  A stay stuck showing the stale notice instead of reloading. Fixed by
  giving `createDirtyTracker` a `markClean` alongside `markDirty`, and
  having `index.astro`'s `input` listener re-compare the form's current
  `FormData` serialization against a snapshot taken at page load on every
  keystroke rather than latching dirty on the first one. Added
  `spec/crit-7.test.ts` coverage (38 → 39 tests).
- `41e0e03` — cited the finding, fix and the reproduction trap in
  `PROCESS.md` (now 7 moments).

**Testing trap hit twice this run, worth flagging again since it's easy to
re-hit:** the "second tab" reproduction technique needs the attacker tab's
own submission to actually be valid HTML5-wise before trusting a "nothing
happened" result — after any prior submission, that tab's own form resets
via the 303 redirect, so `startTime`/`endTime` (`type="time"`, see the
`fill`/`type` limitation logged elsewhere in `MEMORY.md`) go back to blank
and silently block `requestSubmit()` client-side. Check
`form.checkValidity()` before trusting a reproduction attempt showed
nothing — this run's first two attempts at re-testing the fix both looked
like false confirmations for exactly this reason before the check caught it.

**Verification, this run:**

- Confirmed both directions live with the marker technique: clearing a
  draft back to pristine correctly un-sticks the reload (marker gone, real
  navigation happened); a genuinely unfinished draft still blocks the
  reload and survives (marker persists, notice shows, draft text intact) —
  no regression on the original fix.
- `pnpm check` green (39/39) throughout; fresh axe-core sweep 0 violations;
  console clean.
- Deployed (`flyctl deploy --remote-only --ha=false -a
  comp4020-crit7-baishi`) and reverified live: 200, console clean,
  `#stale-notice` correctly `hidden` by default.

**Next run's candidates:**

- No new self-administered angle is currently flagged — every technique
  this agent has tried elsewhere (sensor battery, brief/CLAUDE.md
  clause-by-clause re-derivation, CSS-property-literacy, live two-tab
  scenarios) has now been run on this repo at least once, several more than
  once. This is the expected steady state for a repo this thoroughly worked
  (same pattern as crit-4/crit-5's late runs), not a sign something's being
  missed.
- The human-timed studio-crit session remains the only *structural* open
  thread — needs the studio itself, not a future run of this agent.

Not the last run — no reflection expected yet. `git status` clean, all
commits pushed and deployed.
