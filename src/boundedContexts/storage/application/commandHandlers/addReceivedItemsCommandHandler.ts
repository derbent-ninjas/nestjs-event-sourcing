import { AddReceivedItemsDto } from '../dto/commands/addReceivedItems.ts/addReceivedItems.dto';
import { AddReceivedItemsResponseDto } from '../dto/commands/addReceivedItems.ts/addReceivedItemsResponse.dto';
import { DataSource } from 'typeorm';
import { RandomService } from '../../../../infrastructure/random/random.service';
import { TimeService } from '../../../../infrastructure/time/time.service';
import { StockMonthEventRepository } from '../../dal/stockMonthEventRepository.service';
import { StockMonth } from '../../domain/aggregates/stockMonth/stockMonth';
import { BadRequestException, Injectable } from '@nestjs/common';
import { RECEIVED_ITEMS_WERE_ALREADY_ADDED } from '../../../../infrastructure/shared/errorMessages';
import { ItemsWereReceived } from '../../domain/aggregates/stockMonth/events/itemsWereReceived';
import { PLACEHOLDER_ID } from '../../../../infrastructure/shared/constants';
import { STORAGE } from '../../../../infrastructure/shared/contexts';
import { StockItem } from '../../domain/aggregates/stockMonth/stockItem';
import { StockMonthHydrationService } from '../hydrations/stockMonthHydration.service';
import { nowToMonthCode } from '../../../../infrastructure/shared/utils/nowToMonthCode';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class AddReceivedItemsCommandHandler {
  constructor(
    private readonly dataSource: DataSource,
    private readonly random: RandomService,
    private readonly time: TimeService,
    private readonly repo: StockMonthEventRepository,
    private readonly hydrationService: StockMonthHydrationService,
  ) {}

  @Transactional()
  async addReceivedItems(
    dto: AddReceivedItemsDto,
  ): Promise<AddReceivedItemsResponseDto> {
    const now = this.time.now();
    const monthCode = nowToMonthCode(now);
    const aggregateId = `${dto.locationId}_${monthCode}`;

    const aggregate =
      await this.hydrationService.hydrateAggregateForId(aggregateId);

    const eventId = this.random.uuid(dto.requestId);
    await this.assertItemsAreNotAlreadyAdded(eventId);

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
        locationId: dto.locationId,
        gateNumber: dto.gateNumber,
        items: dto.items.map((item) => StockItem.fromDto(item, { now })),
      },
    });

    aggregate.apply(event);
    aggregate.assertItemIdsAreUnique();

    await this.repo.save(event);

    return AddReceivedItemsResponseDto.from(aggregateId);
  }

  private async assertItemsAreNotAlreadyAdded(eventId: string): Promise<void> {
    const [existingEvent] = await this.repo.findManyByEventId(eventId);

    if (existingEvent) {
      throw new BadRequestException(RECEIVED_ITEMS_WERE_ALREADY_ADDED);
    }
  }
}
