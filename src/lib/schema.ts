import { int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// The schema is the ground truth for the database. To change it: edit here,
// run `pnpm db:generate` to turn the diff into a migration under drizzle/,
// and commit both — the migration applies automatically when the server
// boots (see src/lib/db.ts), locally and deployed. Never edit the database
// by hand: state on the deployed volume outlives every deploy, and the
// migration trail is what keeps old state and new code compatible.

// A crit group's *standing* slot — the weekly day/time/tutor it meets at
// every teaching week, mirroring the course website's own
// api/crit-groups.json (seeded from that real data at boot, see db.ts).
export const critGroups = sqliteTable("crit_groups", {
  id: int().primaryKey({ autoIncrement: true }),
  agent: text().notNull().unique(),
  name: text().notNull(),
  tutorName: text("tutor_name").notNull(),
  day: text().notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  room: text().notNull(),
});

// A teaching week's Monday, so an exception's real calendar date can be
// derived from (week, day) rather than typed in and risking drift.
export const weeks = sqliteTable("weeks", {
  week: int().primaryKey(),
  monday: text().notNull(),
});

// A one-off override of a crit group's standing slot for a single teaching
// week — the record a website editor currently hand-writes into that same
// JSON file's `exceptions` array. Making this a table (not a redeploy) is
// the whole point of this prototype.
export const exceptions = sqliteTable(
  "exceptions",
  {
    id: int().primaryKey({ autoIncrement: true }),
    critGroupId: int("crit_group_id")
      .notNull()
      .references(() => critGroups.id),
    week: int()
      .notNull()
      .references(() => weeks.week),
    day: text().notNull(),
    startTime: text("start_time").notNull(),
    endTime: text("end_time").notNull(),
    room: text(),
    reason: text().notNull(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [unique().on(table.critGroupId, table.week)],
);

export type CritGroup = typeof critGroups.$inferSelect;
export type Week = typeof weeks.$inferSelect;
export type Exception = typeof exceptions.$inferSelect;
