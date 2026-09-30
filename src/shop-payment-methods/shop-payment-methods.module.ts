import { Module } from '@nestjs/common';
import { ShopPaymentMethodsService } from './shop-payment-methods.service';
import { ShopPaymentMethodsController } from './shop-payment-methods.controller';

@Module({
  controllers: [ShopPaymentMethodsController],
  providers: [ShopPaymentMethodsService],
})
export class ShopPaymentMethodsModule {}
