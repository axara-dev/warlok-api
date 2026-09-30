CREATE TYPE "public"."order_fulfillment_type" AS ENUM('delivery', 'pickup');--> statement-breakpoint
CREATE TYPE "public"."order_payment_method" AS ENUM('cash', 'bank_transfer', 'qris');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'confirmed', 'preparing', 'ready', 'completed', 'canceled');--> statement-breakpoint
ALTER TABLE "order" DROP CONSTRAINT "order_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."order_status";--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "status" SET DATA TYPE "public"."order_status" USING "status"::"public"."order_status";--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "customer_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "customer_email" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "customer_phone" text NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "fulfillment_type" "order_fulfillment_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "payment_method" "order_payment_method" NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "payment_details" jsonb;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "delivery_address" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "delivery_latitude" numeric(10, 7);--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "delivery_longitude" numeric(10, 7);--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "note" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "delivery_fee" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "total" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "order_item" ADD COLUMN "product_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;