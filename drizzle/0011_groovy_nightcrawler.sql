CREATE TABLE "link" (
	"id" text PRIMARY KEY NOT NULL,
	"shop_id" text NOT NULL,
	"icon" text,
	"label" text NOT NULL,
	"url" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "link" ADD CONSTRAINT "link_shop_id_shop_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shop"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "link_shopId_idx" ON "link" USING btree ("shop_id");--> statement-breakpoint
CREATE INDEX "link_isActive_idx" ON "link" USING btree ("is_active");