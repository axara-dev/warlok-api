import { Module } from '@nestjs/common';
import { ShopFulfillmentMethodsService } from './shop-fulfillment-methods.service';
import { ShopFulfillmentMethodsController } from './shop-fulfillment-methods.controller';

@Module({
  controllers: [ShopFulfillmentMethodsController],
  providers: [ShopFulfillmentMethodsService],
})
export class ShopFulfillmentMethodsModule {}
