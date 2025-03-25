import { Inject, Injectable } from '@nestjs/common';
import { INFLUXDB_TOKEN } from '../../../../infrastructure/influxDB/influxDB.module';
import { InfluxDB } from '@influxdata/influxdb-client';
import { GetReceivedProductsStatisticsDto } from '../dto/query/statistics/getReceivedProductsStatistics.dto';
import {
  GetReceivedProductsStatisticsResponseDto
} from '../dto/query/statistics/getReceivedProductsStatisticsResponse.dto';

export interface QueriedPoint {
  _time: string;
  _value: number
  gateNumber: string;
  locationId: string;
}

@Injectable()
export class StatisticsReadService {
  constructor(@Inject(INFLUXDB_TOKEN) private readonly influx: InfluxDB) {}

  async getReceivedProductsStatistics(dto: GetReceivedProductsStatisticsDto): Promise<GetReceivedProductsStatisticsResponseDto> {
    const fluxQuery = `
      from(bucket: "my-bucket")
        |> range(start: -1y)
        |> filter(fn: (r) => r._measurement == "received-products-count")
        |> aggregateWindow(every: ${dto.timeWindow}, fn: sum, createEmpty: false)
        |> yield(name: "sum")
    `;

    const points = await this.queryData(fluxQuery);

    return GetReceivedProductsStatisticsResponseDto.fromPoints(points);
  }

  async getShippedProductsStatistics(dto: GetReceivedProductsStatisticsDto): Promise<GetReceivedProductsStatisticsResponseDto> {
    const fluxQuery = `
      from(bucket: "my-bucket")
        |> range(start: -1y)
        |> filter(fn: (r) => r._measurement == "shipped-products-count")
        |> aggregateWindow(every: ${dto.timeWindow}, fn: sum, createEmpty: false)
        |> yield(name: "sum")
    `;

    const points = await this.queryData(fluxQuery);

    return GetReceivedProductsStatisticsResponseDto.fromPoints(points);
  }

  private queryData(fluxQuery: string): Promise<QueriedPoint[]> {
    const queryApi = this.influx.getQueryApi('my-org')

    return new Promise((resolve, reject) => {
      const results: any[] = []
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row)
          results.push(o)
        },
        error(error) {
          reject(error)
        },
        complete() {
          resolve(results)
        },
      })
    })
  }
}
