# now

## comp4020-crit7-baishi — eighth run, 2026-09-25, ~112h-to-cutoff

The prior run's `now.md` said no new self-administered angle was flagged
and the sensor/technique battery was exhausted. Re-fetched the brief (no
drift), confirmed `pnpm check` green (39/39) and `pnpm audit`/`outdated`
unchanged (same one correctly-left esbuild-via-drizzle-kit dev-server
advisory, same major-only outdated set), then found one genuinely untried
angle by re-reading `src/pages/api/exceptions.ts` and `src/lib/db.ts`
fresh: every prior check had driven the write path through the honest
`<select>`/`<input>`-populated HTML form, never a raw direct POST that
could send a missing or non-numeric `critGroupId`/`week` — exactly the
class of input `CLAUDE.md`'s own "validate server-side, in the data layer"
rule is supposed to cover.

**What changed (1 commit, pushed to `origin/main`, HEAD `fd1332e`; no app
code touched, so no redeploy needed — live URL reconfirmed 200 as-is):**

- `fd1332e` — cited this run's finding in `PROCESS.md` (8th moment). No
  code fix — the check came back clean.

**Verification, this run:**

- Built the server (`astro build`), ran it locally on a free port
  (`node dist/server/entry.mjs`, `DATABASE_PATH` pointed at a scratch
  `.data/test.db`, cleaned up after), and `curl`'d `POST /api/exceptions`
  directly with a missing `critGroupId`, a non-numeric `critGroupId`, a
  non-numeric `week`, and an out-of-range `critGroupId`, plus
  `POST /api/exceptions/<bad-id>/cancel`. Every case resolved to a graceful
  `ValidationError` redirect (`?error=unknown crit group` /
  `?error=not a teaching week this semester`) or a silent no-op for the
  cancel route — no unhandled exception, no 500.
- Along the way, confirmed Astro's own `security.allowedDomains` same-origin
  check (`astro.config.ts`) actively blocks an unauthenticated cross-origin
  POST with a 403 before the handler runs at all — a real CSRF protection
  already deliberately configured for the Fly domain, not something this
  check added.
- **Tooling trap hit and worked around:** the first attempt used port 4399,
  which turned out to already be bound by an unrelated app (`aps-ai-tracker`)
  from a different concurrent sandboxed session — this container is shared,
  same class of cross-session leakage `MEMORY.md` already logs for
  `agent-browser console` output, but this is the first time it showed up as
  a *port* collision serving a foreign app's real content rather than just a
  stray console line. My own `node` process had silently failed to bind and
  exited; `ss -ltnp | grep <port>` (not `pgrep`, which matches its own
  invocation string per the existing `MEMORY.md` entry) revealed the real
  owner. Picked a genuinely free port instead and it worked cleanly. Worth
  adding to `MEMORY.md` if this recurs — one instance isn't yet worth a
  standing entry on its own.

Also closed the one follow-up candidate this run had flagged for itself:
`curl`'d `GET /?error=<script>alert(1)</script>` directly and confirmed the
echoed HTML in the response is properly entity-escaped
(`&lt;script&gt;...&lt;/script&gt;`) — Astro's JSX auto-escaping of
`{error}` holds, no reflected-XSS gap. "Checked, confirmed correct," no
code change, not written up as its own `PROCESS.md` moment (folded under
the same server-boundary theme as the direct-POST check above).

**Next run's candidates:**

- No new self-administered technique is currently flagged — both this
  run's own leads (direct-POST data-layer boundary, reflected-error
  escaping) came back clean.
- The human-timed studio-crit session remains the only *structural* open
  thread.

Not the last run — no reflection expected yet. `git status` clean, all
commits pushed. Live app confirmed 200.
