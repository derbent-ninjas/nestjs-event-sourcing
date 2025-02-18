import { BadRequestException, Injectable } from '@nestjs/common';
import { RemoveShippedItemsDto } from '../dto/commands/removeShippedItems/removeShippedItems.dto';
import { RemoveShippedItemsResponseDto } from '../dto/commands/removeShippedItems/removeShippedItemsResponse.dto';
import { DataSource } from 'typeorm';
import { RandomService } from '../../../../infrastructure/random/random.service';
import { TimeService } from '../../../../infrastructure/time/time.service';
import { StockMonthEventRepository } from '../../dal/stockMonthEventRepository.service';
import { PLACEHOLDER_ID } from '../../../../infrastructure/shared/constants';
import { StockMonth } from '../../domain/aggregates/stockMonth/stockMonth';
import { STORAGE } from '../../../../infrastructure/shared/contexts';
import { StockItem } from '../../domain/aggregates/stockMonth/stockItem';
import { SHIPPED_ITEMS_ALREADY_REMOVED } from '../../../../infrastructure/shared/errorMessages';
import { ItemsWereShipped } from '../../domain/aggregates/stockMonth/events/itemsWereShipped';
import { StockMonthHydrationService } from '../hydrations/stockMonthHydration.service';
import { nowToMonthCode } from '../../../../infrastructure/shared/utils/nowToMonthCode';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class RemoveShippedItemsCommandHandler {
  constructor(
    private readonly dataSource: DataSource,
    private readonly random: RandomService,
    private readonly time: TimeService,
    private readonly repo: StockMonthEventRepository,
    private readonly hydrationService: StockMonthHydrationService,
  ) {}

  @Transactional()
  async removeShippedItems(
    dto: RemoveShippedItemsDto,
  ): Promise<RemoveShippedItemsResponseDto> {
    const now = this.time.now();
    const monthCode = nowToMonthCode(now);
    const aggregateId = `${dto.locationId}_${monthCode}`;

    const aggregate =
      await this.hydrationService.hydrateAggregateForId(aggregateId);

    const eventId = this.random.uuid(dto.requestId);
    await this.assertItemsAreNotAlreadyRemoved(eventId);

    const event = new ItemsWereShipped({
      seqId: PLACEHOLDER_ID,
      eventId,
      eventName: ItemsWereShipped.name,
      aggregateId,
      aggregateName: StockMonth.name,
      contextName: STORAGE,
      causationId: null,
      correlationId: aggregateId,
      version: aggregate.aggregateVersion,
      createdAt: now,
      data: {
        locationId: dto.locationId,
        gateNumber: dto.gateNumber,
        items: dto.items.map((item) => StockItem.fromDto(item, { now })),
      },
    });

    aggregate.apply(event);
    aggregate.assertItemIdsAreUnique();

    await this.repo.save(event);

    return RemoveShippedItemsResponseDto.from(aggregateId);
  }

  private async assertItemsAreNotAlreadyRemoved(
    eventId: string,
  ): Promise<void> {
    const [existingEvent] = await this.repo.findManyByEventId(eventId);

    if (existingEvent) {
      throw new BadRequestException(SHIPPED_ITEMS_ALREADY_REMOVED);
    }
  }
}
