CREATE TABLE `crit_groups` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`agent` text NOT NULL,
	`name` text NOT NULL,
	`tutor_name` text NOT NULL,
	`day` text NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`room` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `crit_groups_agent_unique` ON `crit_groups` (`agent`);--> statement-breakpoint
CREATE TABLE `exceptions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`crit_group_id` integer NOT NULL,
	`week` integer NOT NULL,
	`day` text NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`room` text,
	`reason` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`crit_group_id`) REFERENCES `crit_groups`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`week`) REFERENCES `weeks`(`week`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exceptions_crit_group_id_week_unique` ON `exceptions` (`crit_group_id`,`week`);--> statement-breakpoint
CREATE TABLE `weeks` (
	`week` integer PRIMARY KEY NOT NULL,
	`monday` text NOT NULL
);
