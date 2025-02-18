import { Module } from '@nestjs/common';
import { StockMonthController } from './application/stockMonth.controller';
import { OpenStockMonthCommandHandler } from './application/commandHandlers/openStockMonthCommandHandler.service';
import { RandomModule } from '../../infrastructure/random/random.module';
import { TimeModule } from '../../infrastructure/time/time.module';
import { StockMonthEventRepository } from './dal/stockMonthEventRepository.service';
import { AddReceivedItemsCommandHandler } from './application/commandHandlers/addReceivedItemsCommandHandler.service';
import { RemoveShippedItemsCommandHandler } from './application/commandHandlers/removeShippedItemsCommandHandler.service';
import { StockMonthHydrationService } from './application/hydrations/stockMonthHydration.service';
import { AdjustInventoryCommandHandler } from './application/commandHandlers/adjustInventoryCommandHandler.service';
import { GetStockItemsService } from './application/queries/getStockItems.service';
import { StockProjectionRepository } from './dal/projections/stockProjectionRepository.service';
import { StockProjectionsService } from './application/projections/stockProjections.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMonthEventEntity } from './dal/stockMonthEventEntity';
import { StockProjection } from './dal/projections/stockProjection';
import { StockItemProjection } from './dal/projections/stockItem.projection';

@Module({
  imports: [
    RandomModule,
    TimeModule,
    TypeOrmModule.forFeature([
      StockMonthEventEntity,
      StockProjection,
      StockItemProjection,
    ]),
  ],
  controllers: [StockMonthController],
  providers: [
    OpenStockMonthCommandHandler,
    AddReceivedItemsCommandHandler,
    RemoveShippedItemsCommandHandler,
    AdjustInventoryCommandHandler,
    StockMonthHydrationService,
    StockMonthEventRepository,
    GetStockItemsService,
    StockProjectionRepository,
    StockProjectionsService,
  ],
})
export class StorageModule {}
