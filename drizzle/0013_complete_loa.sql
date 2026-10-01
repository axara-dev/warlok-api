CREATE TABLE "whitelist" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"entity" text,
	"industry" text,
	"scale" text,
	"source" text,
	"reason" text,
	"can_feedback" boolean DEFAULT false NOT NULL,
	"invited_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "whitelist_email_unique" UNIQUE("email")
);
