import { Inject, Injectable } from '@nestjs/common';
import { MessageHeadersDto } from '../dto/messages/messageHeaders.dto';
import { StockProjectionsService } from './stockProjections.service';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { INFLUXDB_TOKEN } from '../../../../infrastructure/influxDB/influxDB.module';
import { AllStockMonthEventTypes } from '../../domain/aggregates/stockMonth/stockMonth';
import { StockMonthWasOpened } from '../../domain/aggregates/stockMonth/events/stockMonthWasOpened';
import { InventoryWasAdjusted } from '../../domain/aggregates/stockMonth/events/inventoryWasAdjusted';
import { ItemsWereReceived } from '../../domain/aggregates/stockMonth/events/itemsWereReceived';
import { ItemsWereShipped } from '../../domain/aggregates/stockMonth/events/itemsWereShipped';
import { StockMonthWasClosed } from '../../domain/aggregates/stockMonth/events/stockMonthWasClosed';
import { exhaustiveTypeException } from 'tsconfig-paths/lib/try-path';

@Injectable()
export class StatisticsProjectionsService {
  constructor(
    private readonly stockProjectionsService: StockProjectionsService,
    @Inject(INFLUXDB_TOKEN) private readonly influx: InfluxDB,
  ) {}

  async project(
    headers: MessageHeadersDto,
    payload: Record<string, any>,
  ) {
    const { event } = await this.stockProjectionsService.getEventAndStock(headers, payload);
    await this.writePoints(event);
  }

  private async writePoints(event: AllStockMonthEventTypes): Promise<void> {
    const writeApi = this.influx.getWriteApi('my-org', 'my-bucket', 'ms')
    const points = this.createPoints(event);
    writeApi.writePoints(points);
    await writeApi.flush();
  }

  private createPoints(event: AllStockMonthEventTypes): Point[] {
    if (event instanceof StockMonthWasOpened) {
      return []
    } else if (event instanceof InventoryWasAdjusted) {
      return []
    } else if (event instanceof ItemsWereReceived) {
      const receivedProductsCountPoints = event.data.items.map(item => {
        return new Point('received-products-count')
          .tag('locationId', event.data.locationId)
          .tag('gateNumber', event.data.gateNumber)
          .tag('isFlammable', String(item.isFlammable))
          .tag('isFragile', String(item.isFragile))
          .tag('temperatureMode', item.temperatureMode)
          .floatField('value', 1);
      })

      return [...receivedProductsCountPoints];
    } else if (event instanceof ItemsWereShipped) {
      const shippedProductsCountPoints = event.data.items.map(item => {
        return new Point('shipped-products-count')
          .tag('locationId', event.data.locationId)
          .tag('gateNumber', event.data.gateNumber)
          .tag('isFlammable', String(item.isFlammable))
          .tag('isFragile', String(item.isFragile))
          .tag('temperatureMode', item.temperatureMode)
          .floatField('value', 1);
      })

      return [...shippedProductsCountPoints];
    } else if (event instanceof StockMonthWasClosed) {
      return []
    } else {
      exhaustiveTypeException(event);
    }
  }
}
