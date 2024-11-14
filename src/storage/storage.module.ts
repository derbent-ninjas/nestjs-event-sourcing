import { Module } from '@nestjs/common';
import { StockMonthController } from './application/stockMonth.controller';
import { OpenStockMonthService } from './application/services/openStockMonth.service';
import { RandomModule } from '../infrastructure/random/random.module';
import { TimeModule } from '../infrastructure/time/time.module';
import { StockMonthEventRepository } from './dal/stockMonthEventRepository.service';
import { DBModule } from '../infrastructure/db/db.module';

@Module({
  imports: [RandomModule, TimeModule, DBModule],
  controllers: [StockMonthController],
  providers: [OpenStockMonthService, StockMonthEventRepository],
})
export class StorageModule {}
