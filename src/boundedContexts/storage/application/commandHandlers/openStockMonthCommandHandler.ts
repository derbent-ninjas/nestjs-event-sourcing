import { BadRequestException, Injectable } from '@nestjs/common';
import { OpenStockMonthResponseDto } from '../dto/commands/openStockMonth/openStockMonthResponse.dto';
import { DataSource } from 'typeorm';
import { OpenStockMonthDto } from '../dto/commands/openStockMonth/openStockMonth.dto';
import { RandomService } from '../../../../infrastructure/random/random.service';
import { nowToMonthCode } from '../../../../infrastructure/shared/utils/nowToMonthCode';
import { TimeService } from '../../../../infrastructure/time/time.service';
import { StockMonthEventRepository } from '../../dal/stockMonthEventRepository.service';
import { STOCK_MONTH_IS_ALREADY_OPENED } from '../../../../infrastructure/shared/errorMessages';
import { PLACEHOLDER_ID } from '../../../../infrastructure/shared/constants';
import { StockMonthWasOpened } from '../../domain/aggregates/stockMonth/events/stockMonthWasOpened';
import { StockMonth } from '../../domain/aggregates/stockMonth/stockMonth';
import { STORAGE } from '../../../../infrastructure/shared/contexts';
import { StockItem } from '../../domain/aggregates/stockMonth/stockItem';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class OpenStockMonthCommandHandler {
  constructor(
    private readonly dataSource: DataSource,
    private readonly random: RandomService,
    private readonly time: TimeService,
    private readonly repo: StockMonthEventRepository,
  ) {}

  @Transactional()
  async openStockMonth(
    dto: OpenStockMonthDto,
  ): Promise<OpenStockMonthResponseDto> {
    const now = this.time.now();
    const monthCode = nowToMonthCode(now);
    const aggregateId = `${dto.locationId}_${monthCode}`;
    const eventId = this.random.uuid();

    await this.assertStockMonthIsNotAlreadyOpened(aggregateId);

    const event = new StockMonthWasOpened({
      seqId: PLACEHOLDER_ID,
      eventId,
      eventName: StockMonthWasOpened.name,
      aggregateId,
      aggregateName: StockMonth.name,
      contextName: STORAGE,
      causationId: null,
      correlationId: aggregateId,
      version: 1,
      createdAt: now,
      data: {
        month: monthCode,
        locationId: dto.locationId,
        items: dto.items.map((item) => StockItem.fromDto(item, { now })),
      },
    });

    const aggregate = StockMonth.createByBaseEvent(event);
    aggregate.assertItemIdsAreUnique();

    await this.repo.save(event);

    return OpenStockMonthResponseDto.from(event);
  }

  private async assertStockMonthIsNotAlreadyOpened(
    aggregateId: string,
  ): Promise<void> {
    const existingEvent = await this.repo.findOneByAggregateId(aggregateId);
    if (existingEvent) {
      throw new BadRequestException(STOCK_MONTH_IS_ALREADY_OPENED);
    }
  }
}
