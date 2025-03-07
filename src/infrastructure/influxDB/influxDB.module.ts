import { Module, Scope } from '@nestjs/common';
import { InfluxDB } from '@influxdata/influxdb-client';
import { config } from '../config/config';

export const INFLUXDB_TOKEN = 'INFLUXDB_TOKEN';

const influxDBProvider = {
  provide: INFLUXDB_TOKEN,
  useValue: new InfluxDB({
    url: config.influxDB.url,
    token: config.influxDB.token,
  }),
  scope: Scope.DEFAULT,
}

@Module({
  providers: [influxDBProvider],
  exports: [influxDBProvider],
})
export class InfluxDBModule {}
