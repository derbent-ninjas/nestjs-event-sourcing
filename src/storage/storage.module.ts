import { Module } from '@nestjs/common';
import { StockMonthController } from './application/stockMonth.controller';
import { OpenStockMonthService } from './application/services/projections/openStockMonth.service';
import { RandomModule } from '../infrastructure/random/random.module';
import { TimeModule } from '../infrastructure/time/time.module';
import { StockMonthEventRepository } from './dal/stockMonthEventRepository.service';
import { DBModule } from '../infrastructure/db/db.module';
import { AddReceivedItemsService } from './application/services/projections/addReceivedItems.service';
import { RemoveShippedItemsService } from './application/services/projections/removeShippedItems.service';
import { HydrationService } from './application/services/projections/hydration.service';
import { AdjustInventoryService } from './application/services/projections/adjustInventory.service';
import { GetStockItemsService } from './application/services/query/getStockItems.service';
import { StockProjectionRepository } from './dal/projections/stock-projection-repository.service';
import { StockProjectionsService } from './application/services/commands/stockProjections.service';

@Module({
  imports: [RandomModule, TimeModule, DBModule],
  controllers: [StockMonthController],
  providers: [
    OpenStockMonthService,
    AddReceivedItemsService,
    RemoveShippedItemsService,
    AdjustInventoryService,
    HydrationService,
    StockMonthEventRepository,
    GetStockItemsService,
    StockProjectionRepository,
    StockProjectionsService,
  ],
})
export class StorageModule {}
