import { beforeAll, describe, expect, inject, it } from "vitest";
import { createReconnectGate } from "../src/lib/live-reload";

// This week's brief: model a slice of a real ANU system, wired end to end,
// with a core flow that survives a reload. The roster's core flow is
// rescheduling a crit group's session for one teaching week; these tests
// assert the contracts that make that a real persisted change, not just a
// page that renders — the same shape as the starter's own guestbook.test.ts
// asserted for the demo it replaces.
const baseUrl = inject("baseUrl");

// Astro checks form POSTs carry a same-origin Origin header (CSRF
// protection); browsers send it automatically, a bare fetch doesn't.
const post = (path: string, body: URLSearchParams) =>
  fetch(new URL(path, baseUrl), {
    method: "POST",
    headers: { origin: baseUrl },
    body,
    redirect: "manual",
  });

describe("rescheduling a session", () => {
  const reason = `spec probe ${process.hrtime.bigint()}`;

  it("accepts a valid reschedule and redirects back to the roster", async () => {
    const res = await post(
      "/api/exceptions",
      new URLSearchParams({
        critGroupId: "3", // baishi
        week: "8",
        day: "Thu",
        startTime: "11:00",
        endTime: "12:30",
        room: "",
        reason,
      }),
    );
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("/");
  });

  it("persists the reschedule: a fresh page load shows it", async () => {
    const res = await fetch(baseUrl);
    const html = await res.text();
    expect(html).toContain(reason);
    expect(html).toContain("Thu 11:00–12:30");
  });

  it("falls back to the group's own room when none is given", async () => {
    const html = await (await fetch(baseUrl)).text();
    expect(html).toContain("Marie Reay Building (155), Room 4.03");
  });

  it("broadcasts the change over the SSE stream", async () => {
    const stream = await fetch(new URL("/api/events", baseUrl));
    expect(stream.headers.get("content-type")).toContain("text/event-stream");
    const reader = stream.body?.getReader();
    if (!reader) throw new Error("no response body");

    await post(
      "/api/exceptions",
      new URLSearchParams({
        critGroupId: "4", // dachi
        week: "8",
        day: "Thu",
        startTime: "13:00",
        endTime: "14:30",
        room: "",
        reason: "live probe",
      }),
    );

    const decoder = new TextDecoder();
    let received = "";
    while (!received.includes("data: changed")) {
      const { value, done } = await reader.read();
      if (done) throw new Error("stream ended before the event arrived");
      received += decoder.decode(value, { stream: true });
    }
    await reader.cancel();
  }, 10_000);
});

describe("validation", () => {
  it("rejects a reason-free request without writing an exception", async () => {
    const res = await post(
      "/api/exceptions",
      new URLSearchParams({
        critGroupId: "3",
        week: "5",
        day: "Thu",
        startTime: "09:00",
        endTime: "10:00",
        room: "",
        reason: "",
      }),
    );
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toMatch(/^\/\?error=/);

    const html = await (await fetch(baseUrl)).text();
    // week 5's standing Wednesday slot should be untouched
    expect(html).not.toContain("Thu 09:00–10:00");
  });

  it("rejects an end time that isn't after the start time", async () => {
    const res = await post(
      "/api/exceptions",
      new URLSearchParams({
        critGroupId: "3",
        week: "6",
        day: "Wed",
        startTime: "10:00",
        endTime: "09:00",
        room: "",
        reason: "bad range",
      }),
    );
    expect(res.headers.get("location")).toMatch(/^\/\?error=/);
  });

  it("rejects a weekend day", async () => {
    const res = await post(
      "/api/exceptions",
      new URLSearchParams({
        critGroupId: "3",
        week: "6",
        day: "Sat",
        startTime: "10:00",
        endTime: "11:00",
        room: "",
        reason: "weekend",
      }),
    );
    expect(res.headers.get("location")).toMatch(/^\/\?error=/);
  });
});

describe("live-reload reconnect gate", () => {
  // The client's EventSource reconnects on its own after any drop -- a
  // network blip, or on Fly.io the machine auto-stopping while idle -- but
  // the in-memory bus keeps no backlog of what it missed. Verified live with
  // agent-browser too (killing and restarting the preview server mid-session
  // to simulate a Fly auto-stop/wake cycle, see memory/now.md); this covers
  // the gate's own decision in isolation, cheaper than a browser round trip.
  it("does not reload on the first connect", () => {
    const shouldReloadOnOpen = createReconnectGate();
    expect(shouldReloadOnOpen()).toBe(false);
  });

  it("reloads on every reconnect after the first", () => {
    const shouldReloadOnOpen = createReconnectGate();
    shouldReloadOnOpen();
    expect(shouldReloadOnOpen()).toBe(true);
    expect(shouldReloadOnOpen()).toBe(true);
  });
});

describe("cancelling a reschedule", () => {
  let exceptionId: string;

  beforeAll(async () => {
    await post(
      "/api/exceptions",
      new URLSearchParams({
        critGroupId: "5", // yunlin
        week: "3",
        day: "Fri",
        startTime: "09:00",
        endTime: "10:00",
        room: "",
        reason: "to be cancelled",
      }),
    );
    const html = await (await fetch(baseUrl)).text();
    // the cancel form's action follows its exception's reason text in the
    // rendered <li>, so anchor the search there rather than assuming an id
    const match = html.match(/to be cancelled[^]*?\/api\/exceptions\/(\d+)\/cancel/);
    if (!match) throw new Error("could not find the exception's cancel form in the roster page");
    exceptionId = match[1];
  });

  it("reverts the week to the group's standing slot", async () => {
    const res = await post(`/api/exceptions/${exceptionId}/cancel`, new URLSearchParams());
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("/");

    const html = await (await fetch(baseUrl)).text();
    expect(html).not.toContain("to be cancelled");
  });
});
