import { DataSource } from 'typeorm';
import { config } from '../config/config';
import { StockMonthEventEntity } from '../../storage/dal/stockMonthEventEntity';
import { StockProjection } from '../../storage/dal/projections/stockProjection';
import { StockItemProjection } from '../../storage/dal/projections/stockItem.projection';

export const databaseProviders = [
  {
    provide: DataSource,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: config.db.host,
        port: config.db.port,
        username: config.db.username,
        password: config.db.password,
        database: config.db.name,
        entities: [StockMonthEventEntity, StockProjection, StockItemProjection],
        synchronize: config.db.synchronize,
      });

      return dataSource.initialize();
    },
  },
];
