import { Module } from '@nestjs/common';
import { StockMonthController } from './application/stockMonth.controller';
import { OpenStockMonthService } from './application/services/openStockMonth.service';
import { RandomModule } from '../infrastructure/random/random.module';
import { TimeModule } from '../infrastructure/time/time.module';

@Module({
  imports: [RandomModule, TimeModule],
  controllers: [StockMonthController, OpenStockMonthService],
})
export class StorageModule {}
