import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { auth } from "./auth";
import { validateEnv } from "./config/env.validation";
import { DatabaseModule } from "./database/database.module";
import { UsersController } from "./users/users.controller";
import { ShopsModule } from "./shops/shops.module";
import { HealthModule } from "./health/health.module";
import { ProductsModule } from "./products/products.module";
import { SubscriptionsModule } from "./subscriptions/subscriptions.module";
import { SchedulesModule } from "./schedules/schedules.module";
import { OrdersModule } from "./orders/orders.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { ShopPaymentMethodsModule } from "./shop-payment-methods/shop-payment-methods.module";
import { ShopFulfillmentMethodsModule } from "./shop-fulfillment-methods/shop-fulfillment-methods.module";
import { ShopCategoriesModule } from "./shop-categories/shop-categories.module";
import { ProductCategoriesModule } from "./product-categories/product-categories.module";
import { PaymentsModule } from "./payments/payments.module";
import { LinksModule } from "./links/links.module";
import { isWhitelistEnabled } from "./whitelist/whitelist";
import { WhitelistModule } from "./whitelist/whitelist.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnv
    }),
    ScheduleModule.forRoot(),
    AuthModule.forRoot({ auth }),
    DatabaseModule,
    ShopsModule,
    HealthModule,
    ProductsModule,
    SubscriptionsModule,
    SchedulesModule,
    OrdersModule,
    ReviewsModule,
    ShopPaymentMethodsModule,
    ShopFulfillmentMethodsModule,
    ShopCategoriesModule,
    ProductCategoriesModule,
    PaymentsModule,
    LinksModule,
    ...(isWhitelistEnabled ? [WhitelistModule] : [])
  ],
  controllers: [UsersController],
  providers: []
})
export class AppModule {}
