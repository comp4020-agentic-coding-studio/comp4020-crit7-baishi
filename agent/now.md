---
updated: 2026-09-23
deliverable: comp4020-crit7-baishi
---

# Now

## State (first run, 167h to cutoff)

First run on `comp4020-crit7-baishi` — no prior hand-off existed for this
repo. Brief fetched from
`https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/api/crits/07-anu-system.json`:
model a slice of a real ANU system, wired end to end, with a core flow that
survives a reload, deployed live on Fly.io (week 8+ repo).

Built **Crit roster**: this course's own six crit groups, their standing
weekly slots, and a database-backed reschedule/cancel mechanism replacing the
course website's hand-edited `api/crit-groups.json` exceptions array. Seed
data (six groups, twelve teaching weeks, the two real week-9 Labour-Day
reschedules) is read verbatim from that published JSON — a legitimate,
non-guessed URL per the course's own three-layer doctrine
(`/home/ben/projects/comp4020/CLAUDE.md`: website `/api/*.json` is public
truth other layers sync).

Work done, in five commits (`56af91f` schema/db, `ad5e097` API routes,
`ecd41fc` UI, `ceeebb9` spec, `9e4bdff` docs, `753eb6e` PROCESS.md — 6 total):

- Schema: `crit_groups` × `weeks` × `exceptions` (unique on
  `(crit_group_id, week)`), session date derived not stored.
- Two API routes (`/api/exceptions` POST, `/api/exceptions/[id]/cancel`
  POST), plain form + 303 redirect, no client JS on the write path.
- Live cross-tab sync via the starter's existing SSE bus, broadcasting a bare
  `"changed"` event.
- `spec/crit-7.test.ts`: valid reschedule persists + falls back to the
  group's room + broadcasts over SSE; empty reason / bad time range /
  weekend day all rejected without writing a row; cancel reverts to standing
  slot. 33/33 tests green, `pnpm check` clean.
- `README.md`, `PROCESS.md` (citing real commits, 150–300 word crit
  guidance), and this repo's own `CLAUDE.md` all written for real.
- Interactive live verification with `agent-browser` **two real tabs**
  (`tab new`): submitted a reschedule in tab 1, confirmed tab 2's
  `EventSource` fired a genuine navigation (a `window.__marker` set before
  the change was gone after) and showed the new session — not just the
  vitest SSE-stream assertion. Console clean both tabs. Cancel flow also
  driven live, not just at the HTTP layer.
- Deployed: `flyctl deploy --remote-only --ha=false -a comp4020-crit7-baishi`
  succeeded (first deploy for this repo, app existed but had no image yet).
  Live URL `https://comp4020-crit7-baishi.fly.dev/` verified both by `curl`
  (200 on `/` and `/readme/`) and `agent-browser` (console clean, full-page
  screenshot confirms real seed data rendering correctly).
- Pushed to `origin/main` (`753eb6e`).
- `pnpm check:evidence`: only the expected reflection-missing failure (not
  the last run yet); CLAUDE.md present, all citations resolve — confirmed by
  reading `scripts/check-evidence.ts` directly rather than trusting the
  single printed failure line, per the established shared-`failed`-flag
  caution in `MEMORY.md`.

## Next action

Not the last run — no reflection expected yet. A future run should treat
this as a genuinely fresh repo for deepening: no accessibility sweep
(axe-core/html-validate/Lighthouse), no keyboard tab-order walk, no
200%-zoom reflow check, and no `pnpm audit`/`outdated` pass have been run
yet, unlike the many-runs-deep crit-4/crit-5/ass-2 repos elsewhere in this
file. The reschedule form's `<select>`-based UI (one shared form for all six
groups rather than a form per group) hasn't been checked for real keyboard
operability (tab order through six selects + two time inputs + text inputs),
and the SSE reconnect behaviour (what happens to a tab if the Fly machine
auto-stops mid-session, given `min_machines_running = 0`) is untested and
worth a look given this is the first crit repo on this Fly.io setup.
