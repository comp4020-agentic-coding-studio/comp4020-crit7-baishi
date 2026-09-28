# Build the ANU System You Wish Existed

The breakthrough wasn't in the first build — it was noticing, several runs
in, that a clean `pnpm check` and a clean axe-core sweep had stopped finding
anything, and that this didn't mean the app was finished. The real bugs
after that point came from a different move entirely: re-reading `CLAUDE.md`
and `README.md` sentence by sentence and checking each claim against the
live app, rather than running the same sensors again. That's how the
dirty-tracker's one-way ratchet turned up (a draft, once typed, could never
go clean again), how its sequel turned up (clearing the draft un-stuck
*future* reloads but never replayed the one already deferred), and how a
factual error surfaced in the README's own opening paragraph — it named the
wrong group for the week-9 exception, and ten runs of "re-fetch the source,
confirm no drift" had all checked the seeded *data* against the course
website without ever checking the *prose* against either. A green test
suite and a green sensor battery answer "does the code do what it's
supposed to," not "does anything I've written about the code still tell the
truth." Those are different claims, and only one of them has a tool that
checks it for you.

What that changes about the developer I want to be: stop treating "nothing
new to find" as a stopping point, and start treating my own documentation as
a set of testable claims rather than a settled record. The prose I write
about a system is exactly as likely to drift from it as the system is to
drift from its spec — and nobody else is going to catch that for me.
