import { Injectable } from '@nestjs/common';
import { MessageHeadersDto } from '../../dto/messages/messageHeaders.dto';
import {
  StockMonthWasOpened,
  StockMonthWasOpenedData,
} from '../../../domain/aggregates/stockMonth/events/stockMonthWasOpened';
import {
  InventoryWasAdjusted,
  InventoryWasAdjustedData,
} from '../../../domain/aggregates/stockMonth/events/inventoryWasAdjusted';
import {
  ItemsWereReceived,
  ItemsWereReceivedData,
} from '../../../domain/aggregates/stockMonth/events/itemsWereReceived';
import {
  ItemsWereShipped,
  ItemsWereShippedData,
} from '../../../domain/aggregates/stockMonth/events/itemsWereShipped';
import {
  StockMonthWasClosed,
  StockMonthWasClosedData,
} from '../../../domain/aggregates/stockMonth/events/stockMonthWasClosed';
import { StockProjectionRepository } from '../../../dal/projections/stock-projection-repository.service';
import { StockProjection } from '../../../dal/projections/stockProjection';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AllStockMonthEventTypes } from '../../../domain/aggregates/stockMonth/stockMonth';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway()
export class StockProjectionsService {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly repo: StockProjectionRepository) {}

  async project(
    headers: MessageHeadersDto,
    payload: Record<string, any>,
  ): Promise<void> {
    const { stock, event } = await this.getEventAndStock(headers, payload);
    const { orphanedItems } = stock.project(event);
    await this.repo.save(stock, orphanedItems);
    this.server.emit('StockEvent', event);
  }

  private async getEventAndStock(
    headers: MessageHeadersDto,
    payload: Record<string, any>,
  ): Promise<{ event: AllStockMonthEventTypes; stock: StockProjection }> {
    if (headers.eventName === StockMonthWasOpened.name) {
      const data = await this.validatePayload(StockMonthWasOpenedData, payload);
      const event = new StockMonthWasOpened({
        ...headers,
        seqId: headers.messageId,
        data,
      });
      return { event, stock: new StockProjection() };
    } else if (headers.eventName === InventoryWasAdjusted.name) {
      const data = await this.validatePayload(
        InventoryWasAdjustedData,
        payload,
      );
      const event = new InventoryWasAdjusted({
        ...headers,
        seqId: headers.messageId,
        data,
      });
      const stock = await this.getOneByLocationId(event.data.locationId);
      return { event, stock };
    } else if (headers.eventName === ItemsWereReceived.name) {
      const data = await this.validatePayload(ItemsWereReceivedData, payload);
      const event = new ItemsWereReceived({
        ...headers,
        seqId: headers.messageId,
        data,
      });
      const stock = await this.getOneByLocationId(event.data.locationId);
      return { event, stock };
    } else if (headers.eventName === ItemsWereShipped.name) {
      const data = await this.validatePayload(ItemsWereShippedData, payload);
      const event = new ItemsWereShipped({
        ...headers,
        seqId: headers.messageId,
        data,
      });
      const stock = await this.getOneByLocationId(event.data.locationId);
      return { event, stock };
    } else if (headers.eventName === StockMonthWasClosed.name) {
      const data = await this.validatePayload(StockMonthWasClosedData, payload);
      const event = new StockMonthWasClosed({
        ...headers,
        seqId: headers.messageId,
        data,
      });
      const stock = await this.getOneByLocationId(event.data.locationId);
      return { event, stock };
    }

    throw new Error(`UNKNOWN EVENT, ${headers}, ${payload}`);
  }

  private async getOneByLocationId(
    locationId: string,
  ): Promise<StockProjection> {
    const stock = await this.repo.findOneByLocationId(locationId);

    if (!stock) {
      throw new Error(`Stock not found ${{ locationId }}`);
    }

    return stock;
  }

  private async validatePayload<T extends Record<string, any>>(
    cls: ClassConstructor<T>,
    payload: Record<string, any>,
  ): Promise<T> {
    const plainPayload = plainToInstance(cls, payload);
    const errors = await validate(plainPayload, {
      validationError: { target: false },
    });

    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }

    return plainPayload;
  }
}
