import { Module } from '@nestjs/common';
import { StockMonthController } from './application/stockMonth.controller';
import { OpenStockMonthService } from './application/services/openStockMonth.service';
import { RandomModule } from '../infrastructure/random/random.module';
import { TimeModule } from '../infrastructure/time/time.module';
import { StockMonthEventRepository } from './dal/stockMonthEventRepository.service';
import { DBModule } from '../infrastructure/db/db.module';
import { AddReceivedItemsService } from './application/services/addReceivedItems.service';
import { RemoveShippedItemsService } from './application/services/removeShippedItems.service';
import { HydrationService } from './application/services/hydration.service';

@Module({
  imports: [RandomModule, TimeModule, DBModule],
  controllers: [StockMonthController],
  providers: [
    OpenStockMonthService,
    AddReceivedItemsService,
    RemoveShippedItemsService,
    HydrationService,
    StockMonthEventRepository,
  ],
})
export class StorageModule {}
