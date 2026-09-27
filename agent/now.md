# now

## comp4020-crit7-baishi — fourteenth run, 2026-09-27, ~64h-to-cutoff

Not the last run. Re-fetched the course source (unchanged, matches the brief
already built against). Confirmed local `main` is up to date with
`origin/main` (no drift). Closed both of the prior run's flagged candidates:
grepped the whole repo for any other build-time markdown import besides
`readme.astro`'s `README.md` — none exists, so the "docs-only, no redeploy
needed" gap the prior run found has no sibling instance here. Re-verified the
live Fly URL against `origin/main` HEAD directly (not just trusting the prior
run's redeploy): `curl`-ed `/readme/`, confirmed it names Shitao/Bada for the
week-9 exception and still correctly names Baishi as this repo's own group,
matching `README.md` verbatim.

Ran the full check suite fresh: `pnpm check` green (44/44 tests, 0 lint
errors), `pnpm audit` unchanged (the one correctly-left esbuild dev-server
advisory via `drizzle-kit`), `pnpm outdated` unchanged (five major-only
entries, correctly left alone). A fresh live axe-core sweep against both
deployed pages (`/` and `/readme/`) came back 0 violations, 0 incomplete on
each, console clean on both. Confirmed the CSS-property-literacy pass
remains correctly inapplicable — grepped for `appearance`/`box-shadow`/
`background:`/`border:`/`touch-action`/`tap-highlight` across both `.astro`
pages and found none; this app has no custom-styled interactive elements to
lose their shape under `forced-colors` or need touch-specific overrides, only
native form controls, same conclusion nine runs' worth of prior checks on
this exact question already reached. No code change, no commit — a
legitimate "checked, confirmed correct" outcome across every angle tried,
not a failure to find work.

## Single most important next action

No new self-administered technique is currently flagged; every prose file
has had the clause-by-clause treatment, the sensor battery is exhausted, and
the deploy is confirmed caught up with source as of this run. Genuinely
nothing outstanding except the human-timed studio-crit session. A future
run with time to spend should re-verify the deployed Fly URL still matches
`origin/main` HEAD again (cheap, and the thirteenth run showed it can drift
silently) before assuming there's nothing to do.

## Prior: thirteenth run, 2026-09-27, ~71h-to-cutoff

Not the last run. Worked the standing "re-verify the deployed Fly URL"
candidate and it found a real gap: the deployed app was stale relative to
`origin/main`.

**What I did:** the eleventh run fixed a factual error in `README.md` (the
week-9 exception belongs to Shitao/Bada, not Baishi) but judged it
"docs-only, no effect on the running app" and deliberately skipped
redeploying. That reasoning didn't hold: `src/pages/readme.astro` does
`import * as readme from "../../README.md"` and compiles it at *build*
time, so README.md's content ships as part of the app proper, unlike
CLAUDE.md/PROCESS.md which never render anywhere. Confirmed live —
`curl https://comp4020-crit7-baishi.fly.dev/readme/` still served the
old, wrong "this run's own group, Baishi" claim, two runs after the source
fix landed. Rebuilt (`CI=true pnpm build`), confirmed the fresh
`dist/server/entry.mjs` served the corrected text locally, then
`flyctl deploy --remote-only --ha=false -a comp4020-crit7-baishi`. Live
`/readme/` now correctly reads "Shitao and Bada... this run's own group,
Baishi, meets on [Wednesday]"; both `/` and `/readme/` are 200,
`agent-browser console` clean on both against the redeployed app. No code
change, no commit — the fix already existed in git, this run just shipped
it. General lesson for the next repo hit by the "docs-only, no redeploy
needed" pattern (see `MEMORY.md`'s doctrine-note habits): check whether the
"doc" file is actually imported/rendered by the app itself before deciding
a change is deploy-inert — a README or similar that's compiled into a
served page is not the same category as a process-narrative file that
never ships.

## Single most important next action

No new self-administered technique is currently flagged; every prose file
has had the clause-by-clause treatment, the sensor battery is exhausted,
and the deploy is now caught up with source. Genuinely nothing outstanding
except the human-timed studio-crit session. A future run with time to
spend could: (1) grep the whole repo for any other file the app imports at
build time (in case a similar "is this really deploy-inert" question
applies elsewhere), or (2) just re-verify the deployed Fly URL still
matches `origin/main` HEAD, since this run demonstrated that check has real
teeth and isn't just busywork.
