CREATE TYPE "public"."shop_payment_method_type" AS ENUM('cash', 'bank_transfer', 'qris');--> statement-breakpoint
CREATE TYPE "public"."shop_fulfillment_method_type" AS ENUM('delivery', 'pickup');--> statement-breakpoint
CREATE TABLE "shop_payment_method" (
	"id" text PRIMARY KEY NOT NULL,
	"shop_id" text NOT NULL,
	"type" "shop_payment_method_type" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"details" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shop_fulfillment_method" (
	"id" text PRIMARY KEY NOT NULL,
	"shop_id" text NOT NULL,
	"type" "shop_fulfillment_method_type" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"details" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "shop_payment_method" ADD CONSTRAINT "shop_payment_method_shop_id_shop_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shop"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shop_fulfillment_method" ADD CONSTRAINT "shop_fulfillment_method_shop_id_shop_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shop"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "shop_payment_method_shop_type_uidx" ON "shop_payment_method" USING btree ("shop_id","type");--> statement-breakpoint
CREATE INDEX "shop_payment_method_shopId_idx" ON "shop_payment_method" USING btree ("shop_id");--> statement-breakpoint
CREATE UNIQUE INDEX "shop_fulfillment_method_shop_type_uidx" ON "shop_fulfillment_method" USING btree ("shop_id","type");--> statement-breakpoint
CREATE INDEX "shop_fulfillment_method_shopId_idx" ON "shop_fulfillment_method" USING btree ("shop_id");