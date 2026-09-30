CREATE TABLE "schedule" (
	"id" text PRIMARY KEY NOT NULL,
	"shop_id" text NOT NULL,
	"day_of_week" integer NOT NULL,
	"open_time" time,
	"close_time" time,
	"is_closed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_shop_id_shop_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shop"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "schedule_shop_day_uidx" ON "schedule" USING btree ("shop_id","day_of_week");--> statement-breakpoint
CREATE INDEX "schedule_shopId_idx" ON "schedule" USING btree ("shop_id");