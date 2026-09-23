# Process overview

## What I built

A crit roster for this course's own six crit groups: each group's standing
weekly slot, plus a database-backed way to reschedule one group's session for
one teaching week — replacing the course website's hand-edited
`crit-groups.json` exceptions array with a real, persisted, live-updating
table.

## How I got here

I picked the system by asking what ANU system I actually deal with, rather
than inventing one: this group's own crit slot, published machine-readably at
the course website's `api/crit-groups.json`. I fetched that JSON and seeded
it verbatim — six groups, twelve teaching weeks, and the two real week-9
reschedules caused by the ACT Labour Day public holiday
([`56af91f`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-baishi/commit/56af91f)) —
so the app opens already showing the real state of the course, not
placeholder data.

I built bottom-up: schema and validated data-access functions first
([`56af91f`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-baishi/commit/56af91f)),
then the two API routes on top of them
([`ad5e097`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-baishi/commit/ad5e097)),
then the page
([`ecd41fc`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-baishi/commit/ecd41fc)).
Keeping validation server-side in `addException` rather than in the route
handler was deliberate: it let `spec/crit-7.test.ts`
([`ceeebb9`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-baishi/commit/ceeebb9))
assert against behaviour — a weekend day, a backwards time range, and a
missing reason are all rejected without writing a row — rather than against
markup.

I corrected two things myself along the way: `drizzle-kit`'s rename-detection
wanted an interactive prompt against the old `messages` migration, so I
deleted and regenerated it rather than answering blind, since nothing had
been deployed to Fly for this repo yet; and an early draft of the seed
exceptions hardcoded numeric `critGroupId`s tied to insertion order, which I
replaced with a lookup by the group's own `agent` string before it could
silently break on a reorder.

I grounded the live-update claim by driving two real browser tabs with
`agent-browser`: submitting a reschedule in one and confirming the other's
`EventSource` listener fired a genuine navigation, not stale client state,
console clean in both.

A second run deepened rather than extended: `pnpm audit` found 19
vulnerabilities in transitive dev/build dependencies, and a plain in-range
`pnpm update` (no pin changed) cleared 18 of them
([`ec369f3`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-baishi/commit/ec369f3)).
The one left is a `drizzle-kit`-pulled `esbuild` dev-server advisory that only
matters if esbuild's own server is exposed to the network, which this app
never does — deliberately left rather than forcing a major `drizzle-kit` bump
for no real exposure. `html-validate` against the built pages found two
`<button>`s and two `<input>`s with no explicit `type`, fixed with the type
each already behaved as
([`4bb2333`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-baishi/commit/4bb2333)).

The most significant finding closed an open question from the first run:
whether the SSE live-sync survives a Fly.io auto-stop/wake cycle
(`min_machines_running = 0`), since the bus in `src/lib/events.ts` is
in-memory and keeps no backlog. Simulating that live with `agent-browser` —
killing and restarting the preview server mid-session, then watching a
second tab's `EventSource` — confirmed the browser's own reconnect guarantee
holds, but also confirmed the real gap it exposes: a "changed" ping
broadcast during the outage window is gone by the time the client
reconnects, so a tab can go stale and never know to refresh until some
unrelated later change arrives. Fixed by reloading on every reconnect after
the first
([`d8d8b2d`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-baishi/commit/d8d8b2d)),
then, per this repo's own rule that every new checkable behaviour gets a
spec line in the same run that adds it, pulled the decision out of the inline
`<script>` into `src/lib/live-reload.ts` so `spec/crit-7.test.ts` could assert
it directly rather than trusting a browser round-trip
([`fd6e497`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-baishi/commit/fd6e497)).

A third run re-checked the seed data against the course website's own
published `api/crit-groups.json` (no drift) and re-read every page fresh
rather than a fourth pass of the same sensors. That found the readme page's
own nav still said "Guestbook" — a leftover from the starter template that
never got updated when the app's whole model changed to a crit roster, while
`index.astro`'s nav had said "Roster" since the first run
([`fc4de33`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-baishi/commit/fc4de33)).
A first-ever Lighthouse run against the built server then scored
`best-practices` 0.96 and `seo` 0.9 for the same favicon-404 console error and
missing meta description this course's other deliverables have hit before;
fixed with a small SVG favicon and a one-line description on each page,
confirmed back to a clean 1.0 across all five categories
([`9e5d566`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-baishi/commit/9e5d566)).
