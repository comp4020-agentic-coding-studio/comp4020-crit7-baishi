import type { APIRoute } from "astro";
import { cancelException } from "../../../../lib/db";
import { bus } from "../../../../lib/events";

// Reverting a reschedule: delete the one week's exception row, which drops
// that group's roster row back to its standing slot (listRoster falls back
// to the group's own day/time/room whenever no exception matches the week).
export const POST: APIRoute = async ({ params, redirect }) => {
  const id = Number(params.id);
  if (Number.isInteger(id)) {
    cancelException(id);
    bus.emit("changed");
  }
  return redirect("/", 303);
};
