import { AddReceivedItemsDto } from '../dto/addReceivedItems.ts/addReceivedItems.dto';
import { AddReceivedItemsResponseDto } from '../dto/addReceivedItems.ts/addReceivedItemsResponse.dto';
import { DataSource, EntityManager } from 'typeorm';
import { RandomService } from '../../../infrastructure/random/random.service';
import { TimeService } from '../../../infrastructure/time/time.service';
import { StockMonthEventRepository } from '../../dal/stockMonthEventRepository.service';
import { StockMonth } from '../../domain/aggregates/stockMonth/stockMonth';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  RECEIVED_ITEMS_WERE_ALREADY_ADDED,
  STOCK_MONTH_NOT_FOUND,
} from '../../../infrastructure/shared/errorMessages';
import { ItemsWereReceived } from '../../domain/aggregates/stockMonth/events/itemsWereReceived';
import { PLACEHOLDER_ID } from '../../../infrastructure/shared/constants';
import { STORAGE } from '../../../infrastructure/shared/contexts';
import { StockItem } from '../../domain/aggregates/stockMonth/stockItem';
import { assertItemIdsAreUnique } from '../../domain/aggregates/stockMonth/utils/asserts/assertItemIdsAreUnique';

@Injectable()
export class AddReceivedItemsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly random: RandomService,
    private readonly time: TimeService,
    private readonly repo: StockMonthEventRepository,
  ) {}

  async runTransaction(
    dto: AddReceivedItemsDto,
  ): Promise<AddReceivedItemsResponseDto> {
    return this.dataSource.transaction('SERIALIZABLE', (transaction) => {
      return this.addReceivedItems(dto, transaction);
    });
  }

  async addReceivedItems(
    dto: AddReceivedItemsDto,
    transaction: EntityManager,
  ): Promise<AddReceivedItemsResponseDto> {
    const aggregateId = dto.stockMonthId;

    const aggregate = await this.hydrateAggregateForId(
      aggregateId,
      transaction,
    );

    const eventId = this.random.uuid(dto.requestId);
    await this.assertItemsAreNotAlreadyAdded(eventId, transaction);
    assertItemIdsAreUnique(dto);

    const now = this.time.now();
    const event = new ItemsWereReceived({
      seqId: PLACEHOLDER_ID,
      eventId,
      eventName: ItemsWereReceived.name,
      aggregateId,
      aggregateName: StockMonth.name,
      contextName: STORAGE,
      causationId: null,
      correlationId: aggregateId,
      version: aggregate.aggregateVersion,
      createdAt: now,
      data: {
        gateNumber: dto.gateNumber,
        items: dto.items.map((item) => StockItem.fromDto(item, { now })),
      },
    });

    await this.repo.save(event, transaction);

    return AddReceivedItemsResponseDto.from(aggregateId);
  }

  private async hydrateAggregateForId(
    aggregateId: string,
    transaction: EntityManager,
  ): Promise<StockMonth> {
    const stockMonthEvents = await this.repo.findManyByAggregateId(
      aggregateId,
      transaction,
    );

    if (stockMonthEvents.length === 0) {
      throw new BadRequestException(STOCK_MONTH_NOT_FOUND);
    }

    const aggregate = StockMonth.createByBaseEvent(stockMonthEvents[0]);

    for (const event of stockMonthEvents) {
      aggregate.apply(event);
    }

    return aggregate;
  }

  private async assertItemsAreNotAlreadyAdded(
    eventId: string,
    transaction: EntityManager,
  ): Promise<void> {
    const [existingEvent] = await this.repo.findManyByEventId(
      eventId,
      transaction,
    );

    if (existingEvent) {
      throw new BadRequestException(RECEIVED_ITEMS_WERE_ALREADY_ADDED);
    }
  }
}
