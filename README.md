# Crit roster

The ANU system this models is the one this agent group sits inside every week:
six crit groups, each with a tutor and a standing weekly slot, meeting through
a semester that has public holidays and a mid-semester break in it. The course
website publishes that roster as a hand-maintained
[`crit-groups.json`](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/api/crit-groups.json),
with a sparse `exceptions` array added by hand whenever a week's slot moves —
week 9 has exactly that: both of Ushini Attanayake's Monday groups, Shitao and
Bada, pushed off Monday 5 October, the ACT Labour Day public holiday, onto
Tuesday and Wednesday respectively. (This run's own group, Baishi, meets on
Wednesdays and has no week-9 exception of its own.) This
app rebuilds that one mechanism as a real, persisted, multi-user database
instead of a JSON file someone edits by hand: reschedule a group's session for
one teaching week, and the change is a row in SQLite that every open tab
learns about live.

The standing schedule (six groups, twelve teaching weeks, real tutor names and
slot times) and the two real week-9 exceptions are seeded verbatim from that
published JSON, so the app opens already showing the real state of the
course, not placeholder data.

## What good looks like here

The core flow is rescheduling: pick a group, a teaching week, a new day/time/
room and a reason, submit, and the roster shows the new session in place of
the standing slot for that one week — with a button to cancel the exception
and fall back to the standing slot again. That flow has to survive a reload
(it's a database row, not client state) and has to notify every other open
tab without anyone refreshing by hand, because the real system this models is
inherently multi-tutor: more than one person can have the roster open at
once, and a change one of them makes is exactly the kind of thing the others
need to see without asking.

Decisions this run made and why:

- **Validation lives server-side, not just in the form.** `<input required>`
  and `type="time"` catch the easy cases, but the actual rules — the day has
  to be a weekday, the end time has to be after the start time, a reason is
  mandatory — are enforced in `addException` (`src/lib/db.ts`) and re-checked
  by `spec/crit-7.test.ts`, because a form's client-side constraints are a
  convenience, not the contract.
- **No client JavaScript for the write path.** The reschedule and cancel
  actions are plain HTML forms POSTing to Astro API routes with a 303
  redirect back to `/`; the only script on the page is a small `EventSource`
  listener whose entire job is telling *other* tabs to reload when something
  changes. This was a judgement call, not something `spec/` enforces: a
  scheduling roster doesn't need optimistic UI or partial re-renders, and a
  plain form works with JavaScript disabled.
- **A live reload skips itself while the reschedule form has unsaved input.**
  Found by driving two real tabs with `agent-browser`: typing a draft reason
  in one tab, then submitting an unrelated change from the other, showed the
  first tab's SSE-triggered `location.reload()` silently wiping the draft —
  a real risk for the exact "more than one tutor has this open" scenario the
  live sync exists for. `src/lib/live-reload.ts`'s `createDirtyTracker`
  tracks the reschedule form's own `input` event; a reload that would
  otherwise fire (on a message, or on a post-first reconnect) shows a small
  status notice instead until the draft is submitted or abandoned.
- **Live sync is a single in-process event bus**, valid because this app runs
  on exactly one Fly.io machine (`fly.toml` pins `min-machines-running` /
  standalone HA off). A real multi-machine deployment would need a shared
  pub/sub layer instead — noted here because it's the kind of thing that's
  easy to get away with in a demo and wrong to ship without noticing.
- **Rescheduling twice in the same week replaces the existing exception**
  rather than stacking two, matching the real spreadsheet-style workflow this
  models: a week has at most one "what actually happened" entry.
- **What's out of scope**: there's no login and no per-tutor ownership of a
  reschedule — anyone with the URL can reschedule any group's session, which
  matches the real system (the JSON file is edited by whoever notices a
  holiday clash first) but wouldn't be right for a system with actual stakes.

`spec/crit-7.test.ts` enforces the reschedule/validation/cancel contracts
described above against the built server, plus the shipped invariants
(`spec/invariants.test.ts`) check every route for a landmark nav, one `h1`,
alt text and a clean axe-core pass. Prose judgements — whether the copy reads
well, whether the seeded data is a fair sample of the real system — are
mine, not the test suite's.
