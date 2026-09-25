# now

## comp4020-crit7-baishi — ninth run, 2026-09-25, ~106h-to-cutoff

Not the last run. Deepened rather than finished: followed up on the eighth
run's still-open thread (nothing new self-administered was flagged) by
re-examining the seventh run's own `markClean` fix instead of reaching for a
fresh sensor, and found it was only half-complete.

**What I found:** `markClean` correctly un-sticks *future* reload attempts
once a dirty draft is undone, but a change that had already arrived *while*
dirty (reload skipped, stale notice shown instead) was never retried once
the draft cleared — the tab sat on the stale notice indefinitely, with no
automatic recovery short of an unrelated further change or a manual
refresh. Confirmed live with two `agent-browser` tabs and the
`window.__marker` technique already established in this repo's memory:
marked one tab dirty, triggered a real reschedule from the other (notice
shown, marker correctly untouched), then cleared the draft back to
pristine and found the marker *still* untouched — proving no reload had
fired even though the tab was now clean.

**Fix:** added `notePendingReload`/`claimPendingReload` to
`createDirtyTracker()` in `src/lib/live-reload.ts`. A reload site
(`reloadUnlessDirty` in `index.astro`) calls `notePendingReload` whenever
it skips a reload because of `isDirty`; the form's own `input` handler
calls `claimPendingReload` right after `markClean` and fires the deferred
reload immediately if one was pending. Commit `8212382`.

**Verified:** re-ran the same two-tab scenario post-fix — clearing the
draft now genuinely navigates (marker gone, roster shows the other tab's
change). Added `spec/crit-7.test.ts` coverage per this repo's own
`CLAUDE.md` rule (39 → 41 tests, green). Fresh axe-core sweep: 0
violations. `pnpm check` green throughout. Cited in `PROCESS.md` as the
9th moment (`5476344`). Pushed both commits to `origin/main`, redeployed
via `flyctl deploy --remote-only --ha=false -a comp4020-crit7-baishi`
(succeeded), reconfirmed the live URL
(`https://comp4020-crit7-baishi.fly.dev/`) returns 200, console clean,
correct real seed data.

Also updated `memory/MEMORY.md`: added a durable lesson (a bidirectional
gate fix only permits the *next* attempt through it — it doesn't
retroactively resolve an attempt already deferred/failed; check both
separately) and folded both the eighth run's (untouched until now) and
this ninth run's summaries into the `comp4020-crit7-baishi` open-threads
narrative.

## Single most important next action

No new self-administered technique is currently flagged for this repo —
nine runs deep, the technical/content sensor battery (audit, outdated,
html-validate, Lighthouse, axe-core, keyboard tab-order, 200%-zoom
reflow, live two-tab dirty-tracker/reconnect-gap checks, direct-POST
server-boundary checks, brief-clause re-derivation against both the
course source and this repo's own `CLAUDE.md`) has all been run at least
once, several found and fixed real bugs, and the last two runs in a row
came back clean or closed a genuinely-deep one-off gap rather than
surfacing a new class of finding. The human-timed studio-crit session
remains the only standing structural open thread — nothing left for a
future self-administered run to chase without inventing busywork. If a
future run does pick this back up, the one thing genuinely worth a fresh
look (flagged but not yet tried) is whether `createReconnectGate`'s
simple boolean-flip design has any comparable "resolved vs. merely
possible" gap the dirty-tracker just had — on inspection this looks
unlikely (the gate has no notice-then-defer step to leave unresolved,
just "should I reload on this open event, yes/no"), but it hasn't been
explicitly checked the way the dirty tracker just was.
