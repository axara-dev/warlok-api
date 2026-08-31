import { Module } from "@nestjs/common";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { auth } from "./auth";
import { DatabaseModule } from "./database/database.module";
import { UsersController } from "./users/users.controller";
import { ShopsModule } from "./shops/shops.module";
import { HealthModule } from "./health/health.module";
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    AuthModule.forRoot({ auth }),
    DatabaseModule,
    ShopsModule,
    HealthModule,
    ProductsModule
  ],
  controllers: [UsersController],
  providers: []
})
export class AppModule {}
