ALTER TABLE "review" DROP CONSTRAINT "review_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "review" DROP CONSTRAINT "review_order_id_order_id_fk";
--> statement-breakpoint
ALTER TABLE "review" DROP CONSTRAINT "review_shop_id_shop_id_fk";
--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_shop_id_shop_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shop"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_rating_check" CHECK ("review"."rating" >= 1 AND "review"."rating" <= 5);