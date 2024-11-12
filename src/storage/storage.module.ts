import { Module } from '@nestjs/common';
import { StockMonthController } from './application/stockMonth.controller';

@Module({
  controllers: [StockMonthController],
})
export class StorageModule {}
