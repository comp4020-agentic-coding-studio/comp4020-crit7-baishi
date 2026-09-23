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
