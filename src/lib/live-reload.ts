// EventSource reconnects on its own after any dropped connection -- a
// network blip, or on Fly.io the machine auto-stopping while idle -- but
// the in-memory bus (src/lib/events.ts) keeps no backlog, so a "changed"
// ping broadcast during the gap is gone by the time the client reconnects.
// This gate turns each reconnect's "open" event into a reload, skipping the
// very first connect so a normal page load doesn't reload itself.
export function createReconnectGate(): () => boolean {
  let connectedBefore = false;
  return () => {
    const shouldReload = connectedBefore;
    connectedBefore = true;
    return shouldReload;
  };
}

// A `location.reload()` triggered by someone else's change is safe only when
// there's nothing of the tutor's own to lose -- if they're mid-way through
// filling in a reschedule, the same reload that shows the other tutor's
// change also silently wipes whatever they'd already typed. `markDirty` is
// meant to be wired to the reschedule form's own `input` event; `isDirty`
// gates every reload site below on it.
//
// `markClean` exists because dirty isn't a one-way trip: a tutor who types a
// draft and then clears it back out (or undoes it) has nothing left to lose
// either, and without a way back to clean, that tab's live sync would stay
// broken for the rest of its life over a draft that no longer exists.
// index.astro calls markClean whenever the form's current values match its
// snapshot at page load.
//
// Going clean isn't enough on its own, though: if a change already arrived
// while dirty (a reload was skipped and the stale notice shown instead),
// clearing the draft afterwards has nothing left to lose either, but
// nothing re-checks that missed reload -- the tab would sit on the stale
// notice until some unrelated further change happened to arrive, or the
// tutor manually refreshed. `notePendingReload`/`claimPendingReload` close
// that gap: a reload site calls `notePendingReload` whenever it skips a
// reload because of `isDirty`, and index.astro's `input` handler calls
// `claimPendingReload` right after `markClean` to fire the deferred reload
// immediately, instead of waiting for a fresh trigger that might never come.
export function createDirtyTracker(): {
  markDirty: () => void;
  markClean: () => void;
  isDirty: () => boolean;
  notePendingReload: () => void;
  claimPendingReload: () => boolean;
} {
  let dirty = false;
  let pendingReload = false;
  return {
    markDirty: () => {
      dirty = true;
    },
    markClean: () => {
      dirty = false;
    },
    isDirty: () => dirty,
    notePendingReload: () => {
      pendingReload = true;
    },
    claimPendingReload: () => {
      const had = pendingReload;
      pendingReload = false;
      return had;
    },
  };
}
