import { Module } from '@nestjs/common';
import { StorageModule } from './boundedContexts/storage/storage.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { config } from './infrastructure/config/config';
import { StockMonthEventEntity } from './boundedContexts/storage/dal/stockMonthEventEntity';
import { StockProjection } from './boundedContexts/storage/dal/projections/stockProjection';
import { StockItemProjection } from './boundedContexts/storage/dal/projections/stockItem.projection';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          type: 'postgres',
          host: config.db.host,
          port: config.db.port,
          username: config.db.username,
          password: config.db.password,
          database: config.db.name,
          entities: [
            StockMonthEventEntity,
            StockProjection,
            StockItemProjection,
          ],
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
    }),
    StorageModule,
  ],
})
export class AppModule {}
