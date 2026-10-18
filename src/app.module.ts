import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { ScheduleModule } from "@nestjs/schedule";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { DrizzleModule } from "@nestjs/drizzle";
import { db } from "./db";
import { auth } from "./auth";
import { validateEnv } from "./config/env.validation";
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
import { KeysModule } from "./keys/keys.module";
import { AppController } from "./app.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnv
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.get<number>("THROTTLE_TTL", 60_000),
            limit: configService.get<number>("THROTTLE_LIMIT", 10)
          }
        ]
      })
    }),
    ScheduleModule.forRoot(),
    DrizzleModule.forRoot({ db, autoCloseConnection: false }),
    AuthModule.forRoot({ auth }),
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
    ...(isWhitelistEnabled ? [WhitelistModule] : []),
    KeysModule
  ],
  controllers: [AppController, UsersController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
