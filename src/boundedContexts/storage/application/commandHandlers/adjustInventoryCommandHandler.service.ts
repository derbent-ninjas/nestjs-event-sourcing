import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { RandomService } from '../../../../infrastructure/random/random.service';
import { TimeService } from '../../../../infrastructure/time/time.service';
import { StockMonthEventRepository } from '../../dal/stockMonthEventRepository.service';
import { StockMonthHydrationService } from '../hydrations/stockMonthHydration.service';
import { AdjustInventoryDto } from '../dto/commands/adjustInventory/adjustInventory.dto';
import { AdjustInventoryResponseDto } from '../dto/commands/adjustInventory/adjustInventoryResponse.dto';
import { nowToMonthCode } from '../../../../infrastructure/shared/utils/nowToMonthCode';
import { INVENTORY_WAS_ALREADY_ADJUSTED } from '../../../../infrastructure/shared/errorMessages';
import { PLACEHOLDER_ID } from '../../../../infrastructure/shared/constants';
import { StockMonth } from '../../domain/aggregates/stockMonth/stockMonth';
import { STORAGE } from '../../../../infrastructure/shared/contexts';
import { AddReceivedItemsResponseDto } from '../dto/commands/addReceivedItems.ts/addReceivedItemsResponse.dto';
import { InventoryWasAdjusted } from '../../domain/aggregates/stockMonth/events/inventoryWasAdjusted';
import { StockItem } from '../../domain/aggregates/stockMonth/stockItem';

@Injectable()
export class AdjustInventoryCommandHandler {
  constructor(
    private readonly dataSource: DataSource,
    private readonly random: RandomService,
    private readonly time: TimeService,
    private readonly repo: StockMonthEventRepository,
    private readonly hydrationService: StockMonthHydrationService,
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
        locationId: dto.locationId,
        shortageItems: dto.shortageItems.map((i) =>
          StockItem.fromDto(i, { now }),
        ),
        surplusItems: dto.surplusItems.map((i) =>
          StockItem.fromDto(i, { now }),
        ),
      },
    });

    aggregate.apply(event);
    aggregate.assertItemIdsAreUnique();

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
