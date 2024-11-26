import { createId } from "@paralleldrive/cuid2";
import { pgEnum, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const role = pgEnum("role", ["ADMIN", "USER"]);

export const users = pgTable("users", {
  id: varchar("id", { length: 25 })
    .$defaultFn(() => createId())
    .primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 120 }).notNull(),
  hashedPassword: text("hashedPassword").notNull(),
  role: role("role").notNull().default("USER"),
});
