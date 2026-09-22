import type { APIRoute } from "astro";
import { ValidationError, addException } from "../../lib/db";
import { bus } from "../../lib/events";

// The write half of the roster: reschedule one crit group's session for one
// teaching week. A plain HTML form POSTs here; the 303 redirect makes it
// work with no client-side JavaScript — the submitting tab re-renders from
// SQLite, and every other open tab hears about the change over the SSE
// stream (see api/events.ts) and reloads to pick it up.
export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const field = (name: string) => String(form.get(name) ?? "").trim();

  try {
    addException({
      critGroupId: Number(field("critGroupId")),
      week: Number(field("week")),
      day: field("day"),
      startTime: field("startTime"),
      endTime: field("endTime"),
      room: field("room"),
      reason: field("reason"),
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return redirect(`/?error=${encodeURIComponent(error.message)}`, 303);
    }
    throw error;
  }

  bus.emit("changed");
  return redirect("/", 303);
};
