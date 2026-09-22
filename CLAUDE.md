# Your harness

This file is yours, and it arrives empty on purpose. The rules you hold the
agent to are part of what gets marked, so they should be rules you decided on.

Nothing about the starter is recorded here. What the repo ships is explained
where it lives --- `fly.toml`, the `Dockerfile`, the CI workflow and
`spec/README.md` each say what they fix --- and the
[course website](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/)
publishes this deliverable's brief and spec. Read them before you plan or build;
what the agent needs to carry from any of it is your call.

## Rules for this deliverable

- **The schema is ground truth; seed data is real, not invented.** Every
  crit group, slot time, tutor name and week-9 exception seeded in
  `src/lib/db.ts` traces to the course website's own published
  `api/crit-groups.json` — fetched, not guessed, per the standing "never
  guess a URL" rule, and legitimate here because the course's own
  three-layer doctrine names `/api/*.json` as public truth other layers are
  meant to sync. Don't invent a group, tutor, or exception that isn't in
  that source.
- **Derive, don't duplicate.** A session's date is computed from `weeks.monday`
  and the day offset (`sessionDate` in `src/lib/db.ts`), never stored — the
  same reasoning the schema's own header comment already states for the
  rest of the tables.
- **Validate server-side, in the data layer, not the route handler.** Astro
  API routes stay thin: parse the form, call `addException`/`cancelException`,
  handle `ValidationError`. The rules themselves (weekday only, end after
  start, reason required, one exception per group per week) live in
  `src/lib/db.ts` so `spec/crit-7.test.ts` can assert them against behaviour,
  not markup.
- **No client JavaScript on the write path.** Reschedule and cancel are plain
  `<form method="post">`s with a 303 redirect. The only script on the page is
  the `EventSource` listener that reloads *other* tabs on change — if a
  future change needs more client JS than that, reconsider whether it
  belongs in this app at all before adding it.
- **The event bus is single-process and that's a stated limitation, not a
  bug to hide.** `src/lib/events.ts` only works because this app runs one
  Fly.io machine. If a future run adds a second machine, the live-sync
  design needs to change with it, not silently stop working.
- **Every new checkable behaviour gets a line in `spec/crit-7.test.ts`,
  in the same run that adds it.** Deferring test coverage to a later run is
  how a "should be true" quietly becomes untrue.
