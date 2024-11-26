CREATE TYPE "public"."role" AS ENUM('ADMIN', 'USER');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"email" varchar(120) NOT NULL,
	"hashedPassword" text NOT NULL,
	"role" "role" DEFAULT 'USER' NOT NULL
);
