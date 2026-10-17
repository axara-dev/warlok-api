CREATE TABLE "key" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"provider" text NOT NULL,
	"key" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shop_key" (
	"shop_id" text NOT NULL,
	"key_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "shop_key_shop_id_key_id_pk" PRIMARY KEY("shop_id","key_id")
);
--> statement-breakpoint
ALTER TABLE "key" ADD CONSTRAINT "key_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shop_key" ADD CONSTRAINT "shop_key_shop_id_shop_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shop"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shop_key" ADD CONSTRAINT "shop_key_key_id_key_id_fk" FOREIGN KEY ("key_id") REFERENCES "public"."key"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "key_userId_idx" ON "key" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "shop_key_keyId_idx" ON "shop_key" USING btree ("key_id");