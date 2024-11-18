import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { RandomService } from '../../../infrastructure/random/random.service';
import { TimeService } from '../../../infrastructure/time/time.service';
import { StockMonthEventRepository } from '../../dal/stockMonthEventRepository.service';
import { HydrationService } from './hydration.service';
import { AdjustInventoryDto } from '../dto/adjustInventory/adjustInventory.dto';
import { AdjustInventoryResponseDto } from '../dto/adjustInventory/adjustInventoryResponse.dto';
import { nowToMonthCode } from '../../../infrastructure/shared/utils/nowToMonthCode';
import { assertItemIdsAreUnique } from '../../domain/aggregates/stockMonth/utils/asserts/assertItemIdsAreUnique';
import { INVENTORY_WAS_ALREADY_ADJUSTED } from '../../../infrastructure/shared/errorMessages';
import { PLACEHOLDER_ID } from '../../../infrastructure/shared/constants';
import { StockMonth } from '../../domain/aggregates/stockMonth/stockMonth';
import { STORAGE } from '../../../infrastructure/shared/contexts';
import { AddReceivedItemsResponseDto } from '../dto/addReceivedItems.ts/addReceivedItemsResponse.dto';
import { InventoryWasAdjusted } from '../../domain/aggregates/stockMonth/events/inventoryWasAdjusted';

@Injectable()
export class AdjustInventoryService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly random: RandomService,
    private readonly time: TimeService,
    private readonly repo: StockMonthEventRepository,
    private readonly hydrationService: HydrationService,
  ) {}

  async runTransaction(
    dto: AdjustInventoryDto,
  ): Promise<AdjustInventoryResponseDto> {
    return this.dataSource.transaction('SERIALIZABLE', (transaction) => {
      return this.adjustInventory(dto, transaction);
    });
  }

  async adjustInventory(
    dto: AdjustInventoryDto,
    transaction: EntityManager,
  ): Promise<AdjustInventoryResponseDto> {
    const now = this.time.now();
    const monthCode = nowToMonthCode(now);
    const aggregateId = `${dto.locationId}_${monthCode}`;

    const aggregate = await this.hydrationService.hydrateAggregateForId(
      aggregateId,
      transaction,
    );

    const eventId = this.random.uuid(dto.requestId);
    await this.assertInventoryWasAlreadyAdjusted(eventId, transaction);
    const items = [...dto.surplusItems, ...dto.shortageItems];
    assertItemIdsAreUnique({ items });

    const event = new InventoryWasAdjusted({
      seqId: PLACEHOLDER_ID,
      eventId,
      eventName: InventoryWasAdjusted.name,
      aggregateId,
      aggregateName: StockMonth.name,
      contextName: STORAGE,
      causationId: null,
      correlationId: aggregateId,
      version: aggregate.aggregateVersion,
      createdAt: now,
      data: {
        shortageItems: [],
        surplusItems: [],
      },
    });

    await this.repo.save(event, transaction);

    return AddReceivedItemsResponseDto.from(aggregateId);
  }

  private async assertInventoryWasAlreadyAdjusted(
    eventId: string,
    transaction: EntityManager,
  ): Promise<void> {
    const [existingEvent] = await this.repo.findManyByEventId(
      eventId,
      transaction,
    );

    if (existingEvent) {
      throw new BadRequestException(INVENTORY_WAS_ALREADY_ADJUSTED);
    }
  }
}