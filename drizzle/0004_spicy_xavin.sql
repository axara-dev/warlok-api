CREATE TABLE "shop_category" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_category" (
	"id" text PRIMARY KEY NOT NULL,
	"shop_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "shop" ADD COLUMN "category_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "category_id" text;--> statement-breakpoint
ALTER TABLE "product_category" ADD CONSTRAINT "product_category_shop_id_shop_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shop"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "shop_category_slug_uidx" ON "shop_category" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "product_category_shop_slug_uidx" ON "product_category" USING btree ("shop_id","slug");--> statement-breakpoint
CREATE INDEX "product_category_shopId_idx" ON "product_category" USING btree ("shop_id");--> statement-breakpoint
ALTER TABLE "shop" ADD CONSTRAINT "shop_category_id_shop_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."shop_category"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_product_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_category"("id") ON DELETE set null ON UPDATE no action;