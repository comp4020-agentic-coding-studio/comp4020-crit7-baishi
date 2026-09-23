# now

## comp4020-crit7-baishi — third run, 2026-09-23, ~154h-to-cutoff

Worked the prior run's own flagged list: a first-ever Lighthouse run, and a
fresh-eyes read of the pages rather than a fourth pass of the exhausted
technical-sensor battery. Did not try the brief-clause-re-derivation
technique in the deeper sense (re-reading the course source's own prose
clause-by-clause against the code) — only a plain fresh page read, which is
what actually found the bug below. That deeper technique is still worth a
real attempt next time.

**What changed (3 commits, all pushed to `origin/main`, HEAD `7713f90`):**

- `fc4de33` — the readme page's nav still said "Guestbook," a leftover from
  the starter template never updated when the app's model became a crit
  roster (`index.astro`'s nav has said "Roster" since the first run). Found
  by a plain fresh read, not a tool — no test or sensor asserts nav-label
  consistency. See the new generalised `MEMORY.md` entry: grep every page
  for a starter's old vocabulary whenever a rename/entity swap lands, not
  just the pages the diff touched.
- `9e5d566` — first-ever Lighthouse run against the built server (had to run
  `node dist/server/entry.mjs` directly, not `astro preview` — this app's
  build output is `"server"` mode). Scored `best-practices` 0.96 / `seo` 0.9
  for the by-now-familiar favicon-404-console-error + missing-meta-
  description pattern. Fixed with a small SVG favicon (`public/favicon.svg`,
  linked via `rel="icon"`) and a one-line `<meta name="description">` on
  both pages; re-run confirmed all five categories back to 1.0.
- `7713f90` — cited both in `PROCESS.md`.

**Also checked, confirmed correct, no code change:**

- Seed data re-verified against the course website's own published
  `api/crit-groups.json`: still matches verbatim, no drift.
- `pnpm audit`: unchanged, same one `esbuild`-via-`drizzle-kit` dev-server
  advisory, correctly still left (never network-exposed in this app).
- A fresh axe-core sweep on both pages: 0 violations.
- `html-validate` against the live-rendered HTML (not `dist/client` — this
  app has no static client HTML, it's server-rendered): clean.
- `pnpm check`: green, 35/35 tests, throughout.

**Deployed:** `flyctl deploy --remote-only --ha=false -a comp4020-crit7-baishi`
succeeded; live URL reverified via `curl` (200, correct nav/favicon/meta
description) and `agent-browser` (console clean) against
`https://comp4020-crit7-baishi.fly.dev/`.

**Not yet tried (next run's candidates):**

- The brief-clause-re-derivation technique in its full form: re-read the
  course source's own prose (`api/crits/07-anu-system.json`'s markdown body)
  and this repo's own `CLAUDE.md` rules one clause at a time against the
  *current* code — not just a fresh page read. Has found real bugs on other
  deliverables (crit-4, crit-5) after the standard sensor battery went dry;
  only a plain fresh-eyes read has been tried here so far, and it already
  found one real bug, so the deeper technique is worth an honest attempt.
- A `prefers-reduced-motion`/`forced-colors`/CSS-property-literacy pass —
  still untried, still likely low-yield: this app's interactive elements
  (buttons, inputs, links) are all native form controls with no
  `appearance: none`/custom background-based shape to lose under
  `forced-colors`, and there's no motion/animation anywhere to gate behind
  `prefers-reduced-motion`. Worth one real look before writing it off
  entirely, since "likely low-yield" was also the read on crit-4 before four
  real gaps turned up there.
- A real human-timed use session (needs the studio crit itself, not a
  self-administered probe).

Not the last run — no reflection expected yet. `git status` clean, all
commits pushed and deployed.
