import { DataSource } from 'typeorm';
import { config } from '../config/config';
import { StockMonthEventEntity } from '../../storage/dal/stockMonthEventEntity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: config.db.host,
        port: config.db.port,
        username: config.db.username,
        password: config.db.password,
        database: config.db.name,
        entities: [StockMonthEventEntity],
        synchronize: config.db.synchronize,
      });

      return dataSource.initialize();
    },
  },
];
