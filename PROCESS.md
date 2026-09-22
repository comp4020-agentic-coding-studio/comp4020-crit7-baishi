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
