import { Module } from '@nestjs/common';
import { ShopCategoriesService } from './shop-categories.service';
import { ShopCategoriesController } from './shop-categories.controller';

@Module({
  controllers: [ShopCategoriesController],
  providers: [ShopCategoriesService],
})
export class ShopCategoriesModule {}
