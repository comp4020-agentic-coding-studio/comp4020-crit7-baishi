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

A fourth run re-read `CLAUDE.md`'s own rules clause by clause against the
current code rather than another pass of the same sensors, and found a real
coverage gap: the "one exception per group per week" rule is enforced by
`addException` deleting any existing exception for that pair before
inserting the new one, and `README.md` documents this as a deliberate
"replace, not stack" decision — but nothing in `spec/crit-7.test.ts` had ever
posted two reschedules for the same group/week and checked which one won.
Fixed with a test that reschedules group 6's week 11 twice and asserts the
first reason is gone, the second appears exactly once, and the session shows
the second's day/time
([`d81472c`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-baishi/commit/d81472c)).
`pnpm audit` was still clean; `pnpm outdated` had one genuinely in-range
patch (`astro` 7.3.3 → 7.3.4) among otherwise major-only entries, applied via
`pnpm update`
([`0707cf7`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-baishi/commit/0707cf7)).
The same run also drove the write path through a real DOM form submission
for the first time — `requestSubmit()` on the actual `<form>` after filling
its fields via genuine input events, not `fetch()` the way every vitest spec
does it — and a real click on a cancel button, both against a fresh local
`pnpm preview`; console stayed clean and the roster updated correctly in
both cases.

A fifth run tried two checks this repo hadn't had yet: a live keyboard
tab-order walk (clean — nav links, then each seeded exception's cancel
button, then the reschedule form's fields, in visual order, with the
browser's own focus ring visible throughout) and a real 200% browser-zoom
reflow check at the 390px marking width. The zoom check found a genuine,
previously-invisible bug: the reschedule form's cancel button, for any
group with an active exception, ran off the right edge of the viewport with
no way to reach it by scrolling into view cleanly. Tracing it live (not
just reading the CSS) found three separate causes stacked on top of each
other — `input`'s `min-width: 12rem` couldn't shrink for a narrow container,
`fieldset` carries a UA-stylesheet default of `min-width: min-content` that
overrides any container width regardless of overflow settings, and the
cancel button's form was `display: inline`, so it fought the preceding
text for leftover space on one line rather than wrapping onto its own —
fixed all three
([`6996965`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-baishi/commit/6996965)).
Re-verified clean at both marking viewports, zoomed and not, plus a fresh
axe-core sweep (0 violations) and the full `pnpm check` suite.

A sixth run tried a genuinely new interaction rather than re-running the
already-exhausted sensor battery: driving two real `agent-browser` tabs
through the exact "more than one tutor has this open" scenario the README
cites as the whole reason live sync exists, rather than just the redirect
and stream contracts already covered. Typing a draft reason into the
reschedule form in one tab, then submitting a real, unrelated reschedule
from a second tab, found a genuine data-loss bug: the first tab's
SSE-triggered `location.reload()` fired unconditionally and silently wiped
the draft, with no warning. Fixed with a `createDirtyTracker` in
`src/lib/live-reload.ts`, wired to the reschedule form's own `input` event
and checked before every reload site (the plain "message" case and the
post-first-reconnect case both) — a reload that would otherwise fire shows
a small status notice instead, and the same two-tab technique confirmed a
clean tab still reloads normally, no regression
([`e3a4a3d`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-baishi/commit/e3a4a3d)).
`pnpm check` green (38/38 tests) throughout, axe-core still 0 violations,
console clean across all three tabs used in the check.

A seventh run followed up on that fix rather than starting a new sensor
pass: the dirty flag was set on the reschedule form's first `input` event
and never cleared, so a tutor who typed a draft and then cleared it back
out — abandoning the reschedule rather than submitting it — left that tab's
live sync permanently broken for the rest of its life, with nothing left
to actually lose. Confirmed live with two tabs and a `window` marker to
prove no reload had silently happened: clearing a draft back to empty,
then triggering a genuine reschedule from the other tab, left the first
tab showing the stale notice forever instead of reloading. Two attempts at
reproducing this hit the same "the other tab's own submission silently
failed HTML5 validation because its `<input type="time">` fields reset to
blank after the prior redirect" trap logged in this run's own memory —
worth naming here too, since it produced a false "nothing happened" result
twice before checking `form.checkValidity()` caught it. Fixed by giving
`createDirtyTracker` a `markClean` alongside `markDirty`, and having every
`input` event re-compare the form's current values against its snapshot at
page load rather than latching dirty forever
([`38a7d0d`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-baishi/commit/38a7d0d)).
Re-verified both directions live — clearing a draft correctly un-sticks the
reload, and a genuinely unfinished draft still blocks it and survives — plus
a fresh axe-core sweep (0 violations) and `pnpm check` green (39/39 tests).

An eighth run tried an angle none of the prior seven had: hitting
`POST /api/exceptions` and the cancel route directly with `curl`, bypassing
the browser form entirely, to check whether `CLAUDE.md`'s own rule — "validate
server-side, in the data layer, not the route handler" — actually holds at
the real boundary a select/option-populated form can never exercise (a
missing field, a non-numeric `critGroupId`/`week`, an out-of-range id). It
came back clean: `addException` looks up the group and week by id before
touching anything else, so a malformed or missing numeric field resolves to
a graceful `ValidationError` redirect ("unknown crit group",
"not a teaching week this semester") rather than an unhandled exception, and
`astro.config.ts`'s `security.allowedDomains` (Astro's built-in same-origin
check for form POSTs) rejected an unauthenticated cross-origin attempt with
a 403 before the handler ever ran. No code change — a genuine "checked,
confirmed correct" outcome, not a fix, and the first time this app's
server boundary had been tested with anything other than the honest form.

A ninth run followed up on the seventh's own `markClean` fix rather than
starting a new sensor pass, and found the fix was only half of the story:
`markClean` correctly un-sticks *future* reload attempts, but a message
that had already arrived while dirty — reload skipped, the stale notice
shown instead — was never retried once the draft cleared. Confirmed live
with two tabs: typed a draft in one, submitted a real reschedule from the
other (notice shown, draft and a `window` marker both untouched, correctly
matching the seventh run's fix), then cleared the draft back to pristine
and found the marker still intact and the roster still stale — the tab
sat on the notice indefinitely, with no automatic way to catch up short of
an unrelated further change or a manual refresh. Fixed with
`notePendingReload`/`claimPendingReload` in `src/lib/live-reload.ts`: a
reload site records that it deferred one, and the form's own `input`
handler fires it the instant the draft goes clean again
([`8212382`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-baishi/commit/8212382)).
Re-verified the same two-tab scenario live — clearing the draft now
genuinely navigates (the marker is gone, not just unchanged) and the
roster shows the other tab's change — plus a fresh axe-core sweep (0
violations) and `pnpm check` green (41/41 tests).

A tenth run checked the ninth run's own flagged question first —
whether `createReconnectGate`'s plain boolean flip has a comparable
resolved-vs-merely-possible gap to the one just fixed in the dirty
tracker — and confirmed it doesn't: the gate has no notice-then-defer
step to leave unresolved, it only ever answers "should this particular
`open` event reload," and that answer always funnels straight into
`reloadUnlessDirty`, which already owns the deferred-reload bookkeeping.
No code change. Re-fetching the course website's own `api/crit-groups.json`
found the seeded groups, weeks, and both week-9 exceptions still match
verbatim — no drift. `pnpm audit` still clean except the one
correctly-left `esbuild` advisory; `pnpm outdated` had one in-range patch
(`astro` 7.3.4 → 7.3.5), applied
([`a9e6bef`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-baishi/commit/a9e6bef)).
The one real gap found: `sessionDate` — the function CLAUDE.md's own
"derive, don't duplicate" rule names, computing every roster row's real
calendar date from a week's Monday rather than storing it — had never
been asserted directly, only eyeballed against the calendar in a
screenshot. Added three cases including a real seeded week (8) whose
Friday session crosses a month boundary
([`e022569`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-baishi/commit/e022569)).
`pnpm check` green (44/44 tests) throughout, a fresh live-browser check
against a rebuilt server showed the roster still rendering correctly
with a clean console.
