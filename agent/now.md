# now

## comp4020-crit7-baishi — second run, 2026-09-23, ~154h-to-cutoff

Deepened the first run's build rather than adding new features, working the
exact list its own hand-off flagged: a11y/HTML-validation sweep, keyboard
tab-order walk, 200%-zoom reflow check, `pnpm audit`/`outdated`, and the SSE
reconnect behaviour under a simulated Fly.io auto-stop/wake cycle.

**What changed (5 commits, all pushed to `origin/main`, HEAD `7e7a575`):**

- `ec369f3` — `pnpm audit` found 19 vulnerabilities in transitive dev/build
  deps; a plain in-range `pnpm update` (drizzle-orm/drizzle-kit/vitest, no
  pin changed) cleared 18. One left: an `esbuild` dev-server advisory via
  `drizzle-kit`'s deprecated `@esbuild-kit` loader — only matters if
  esbuild's dev server is network-exposed, which this app never does.
  Deliberately left rather than forcing a major `drizzle-kit` bump.
- `4bb2333` — `html-validate` against the built pages found 2 `<button>`s
  and 2 `<input>`s missing an explicit `type`; fixed with the type each
  already behaved as.
- `d8d8b2d` / `fd6e497` — the headline finding. Simulated a Fly.io
  auto-stop/wake cycle live with `agent-browser` (killed and restarted the
  preview server mid-session, watched a second tab's `EventSource`):
  browser reconnection is real and works, but any "changed" ping broadcast
  during the outage is lost forever since the in-memory bus
  (`src/lib/events.ts`) keeps no backlog — a tab can go stale and never
  know to refresh. Fixed by reloading on every reconnect after the first;
  pulled the decision out of the inline `<script>` into
  `src/lib/live-reload.ts` (`createReconnectGate`) so `spec/crit-7.test.ts`
  could assert it directly, per this repo's own `CLAUDE.md` rule that every
  new checkable behaviour gets spec coverage the same run it's added.
- `7e7a575` — cited all of the above in `PROCESS.md`.

**Also checked, confirmed correct, no code change:**

- Keyboard tab-order walk at both marking viewports: nav → per-group cancel
  forms → the reschedule form's fields in visual order, default
  `outline: auto` throughout (no `outline: none` reset in `styles.css`),
  console clean.
- Live axe-core sweep: 0 violations.
- 200%-zoom reflow check via `document.documentElement.style.zoom = '2'`:
  initially looked like a real overflow (`documentElement.scrollWidth: 642`
  vs `clientWidth: 390` on mobile), but no individual element actually
  overflowed and a screenshot showed clean wrapping. Traced to a
  `style.zoom`-specific measurement artifact: `documentElement.scrollWidth`
  itself appears to get inflated by the zoom factor (exactly 2×
  `body.scrollWidth`, which was correctly under the viewport width).
  **Testing-technique note for future runs:** under `style.zoom`, measure
  `body.scrollWidth`/a per-element sweep, not `documentElement.scrollWidth`
  — cross-check with a screenshot before trusting the number.

**Deployed:** `flyctl deploy --remote-only --ha=false -a comp4020-crit7-baishi`
succeeded; live URL confirmed via `curl` (200, real seed data present) and
`agent-browser` (console clean) against `https://comp4020-crit7-baishi.fly.dev/`.

**Not yet tried (next run's candidates):**

- A full Lighthouse run (`CHROME_PATH` + `pnpm dlx lighthouse`) — never done
  on this repo, and has found something on every other deliverable's first
  run in `MEMORY.md`.
- A real human-timed use session (needs the studio crit itself, not a
  self-administered probe).
- Re-applying the brief-clause-re-derivation technique (re-read the course
  source's own prose one clause at a time against the current code) — not
  yet tried on this repo at all, and has found real bugs on other
  deliverables (crit-4, crit-5) after the standard sensor battery went dry.
- A `prefers-reduced-motion`/`forced-colors`/CSS-property-literacy pass —
  this app has almost no custom styling (`styles.css` is minimal), so this
  angle may turn up little, but hasn't been checked at all.

Not the last run — no reflection expected yet. `git status` clean, all
commits pushed.
