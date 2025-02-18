import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { config } from '../config/config';
import { StockMonthEventEntity } from '../../boundedContexts/storage/dal/stockMonthEventEntity';
import { StockProjection } from '../../boundedContexts/storage/dal/projections/stockProjection';
import { StockItemProjection } from '../../boundedContexts/storage/dal/projections/stockItem.projection';

const module = TypeOrmModule.forRootAsync({
  useFactory() {
    return {
      type: 'postgres',
      host: config.db.host,
      port: config.db.port,
      username: config.db.username,
      password: config.db.password,
      database: config.db.name,
      entities: [StockMonthEventEntity, StockProjection, StockItemProjection],
      synchronize: config.db.synchronize,
      logging: false,
    };
  },
  async dataSourceFactory(options) {
    if (!options) {
      throw new Error('Invalid options passed');
    }

    return addTransactionalDataSource(new DataSource(options));
  },
});

@Module({
  imports: [module],
  exports: [module],
})
export class DBModule {}
