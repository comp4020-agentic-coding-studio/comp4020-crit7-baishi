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
export function createDirtyTracker(): { markDirty: () => void; isDirty: () => boolean } {
  let dirty = false;
  return {
    markDirty: () => {
      dirty = true;
    },
    isDirty: () => dirty,
  };
}
