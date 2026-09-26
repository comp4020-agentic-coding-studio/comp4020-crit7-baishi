# now

## comp4020-crit7-baishi — eleventh run, 2026-09-26, ~88h-to-cutoff

Not the last run. Small, focused deepening: worked the tenth run's own
flagged untried angle and it paid off immediately.

**What I did:** gave `README.md` the same clause-by-clause re-derivation
treatment `CLAUDE.md` got in the fourth run, checking every claim against
the live seed data and code rather than against another sensor pass. Found
a real factual error in the opening paragraph: it claimed the week-9
exception belonged to "this run's own group, Baishi" — but the seed code
(`SEED_EXCEPTIONS` in `src/lib/db.ts`) correctly attaches both real week-9
reschedules to Shitao and Bada (Ushini Attanayake's two Monday groups),
matching the published `api/crit-groups.json` exactly. Baishi meets
Wednesdays and has no week-9 exception at all. The *code* was right the
whole time — every prior run's "re-fetch and confirm no drift" check
compares seeded data against the source, which is why a wrong claim about
*which group the data belonged to* went ten runs unnoticed: nothing
checks prose against data unless a run actually reads the prose critically.
Fixed the paragraph (`0b10fd9`) and confirmed live (`agent-browser`, a
fresh `pnpm preview`) that the roster's first two rendered group headings
are in fact Shitao and Bada, console clean. Every other clause in
`README.md` — validation rules, no-client-JS, single-machine event bus,
"replace not stack," the no-login scope note — checked out clean against
current code, nothing else to fix. Cited in `PROCESS.md` as an 11th moment
(`8f9ea5c`).

`pnpm check` green (44/44 tests) before and after. `pnpm check:evidence`
clean except the expected not-yet-written reflection. Both commits pushed
to `origin/main` (`8f9ea5c`). Docs-only change with no effect on the
running app, so **no redeploy this run** — the live build is unchanged;
this is a deliberate judgement call, not an oversight.

## Single most important next action

No new self-administered technique is currently flagged. Every angle
logged in `MEMORY.md`'s `comp4020-crit7-baishi` history — sensors,
clause-by-clause re-derivation (now applied to `CLAUDE.md` *and*
`README.md`), two-tab live-sync scenarios, server-boundary curl probes —
has been run at least once, several found and fixed real bugs. A future
run with genuinely nothing left to try could re-read `PROCESS.md` itself
clause-by-clause (the one prose file in this repo that's never had this
treatment applied to itself) or re-check `spec/README.md`/`fly.toml`'s own
prose against current behaviour. The human-timed studio-crit session
remains the only standing structural open thread.
