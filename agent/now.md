# now

## comp4020-crit7-baishi — tenth run, 2026-09-26, ~95h-to-cutoff

Not the last run. Deepened rather than finished, and kept it small: closed
the ninth run's own flagged follow-up, then found one genuine small gap.

**What I checked and closed:** whether `createReconnectGate`'s plain
boolean-flip design has a comparable "resolved vs. merely possible" gap to
the one the ninth run fixed in the dirty tracker. Read `live-reload.ts` and
`index.astro`'s wiring together: the gate only ever answers "should this
`open` event reload," with no notice-then-defer step of its own — that
answer funnels straight into `reloadUnlessDirty`, which already owns all the
deferred-reload bookkeeping. Confirmed clean, no code change.

**What I found:** `sessionDate` — the pure function `CLAUDE.md`'s own
"derive, don't duplicate" rule names, computing every roster row's real
calendar date from a week's Monday rather than storing it — had never been
asserted directly in `spec/crit-7.test.ts`, only eyeballed against the
calendar via screenshots across nine prior runs. Added three cases
(same-day, mid-week offset, and a real seeded week — week 8 — whose Friday
session genuinely crosses a month boundary), commit `e022569`.

**Routine drift checks, all clean:** re-fetched the course website's own
`api/crit-groups.json` — seeded groups, weeks, and both week-9 exceptions
still match verbatim, no drift. `pnpm audit` still clean except the one
correctly-left `esbuild` dev-server advisory. `pnpm outdated` had one
in-range patch (`astro` 7.3.4 → 7.3.5), applied (`a9e6bef`). A fresh
`html-validate` pass against the live-rendered home and readme pages (fixed
my own wrong guess at the readme's route — it's `/readme`, not `/about`,
Astro's 404 page was what `/about` had been validating) came back fully
clean on both, no findings at all — not even the usual expected doctype/
void-style non-issues this time, since html-validate didn't flag anything
in either page's actual markup.

`pnpm check` green (44/44 tests) throughout. Live-browser check against a
freshly rebuilt server: console clean, roster renders correctly with real
seed data. `PROCESS.md` now at 10 cited moments, `pnpm check:evidence`
clean except the expected not-yet-written reflection. All 4 commits pushed
to `origin/main` (`9f265af`), redeployed via
`flyctl deploy --remote-only --ha=false -a comp4020-crit7-baishi`
(succeeded), reconfirmed the live URL
(`https://comp4020-crit7-baishi.fly.dev/`) returns 200, console clean.

## Single most important next action

No new self-administered technique is currently flagged — ten runs deep,
every sensor and re-derivation angle logged in `MEMORY.md`'s
`comp4020-crit7-baishi` history has been run at least once, several found
and fixed real bugs, and this run's two closest-remaining follow-up
questions (the reconnect gate, `sessionDate` coverage) both resolved
cleanly with only a small test-coverage gap to show for it. The
human-timed studio-crit session remains the only standing structural open
thread. If a future run wants a genuinely fresh angle rather than another
pass of the exhausted battery, the untried one is: re-read `README.md`
itself clause-by-clause the way `CLAUDE.md` already got in the fourth run
— it hasn't had that specific treatment yet, only spot-checks (the nav
mismatch, the "replace not stack" claim).
