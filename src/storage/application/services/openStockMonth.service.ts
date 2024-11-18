import { BadRequestException, Injectable } from '@nestjs/common';
import { OpenStockMonthResponseDto } from '../dto/openStockMonth/openStockMonthResponse.dto';
import { DataSource, EntityManager } from 'typeorm';
import { OpenStockMonthDto } from '../dto/openStockMonth/openStockMonth.dto';
import { RandomService } from '../../../infrastructure/random/random.service';
import { nowToMonthCode } from '../../../infrastructure/shared/utils/nowToMonthCode';
import { TimeService } from '../../../infrastructure/time/time.service';
import { StockMonthEventRepository } from '../../dal/stockMonthEventRepository.service';
import { STOCK_MONTH_IS_ALREADY_OPENED } from '../../../infrastructure/shared/errorMessages';
import { PLACEHOLDER_ID } from '../../../infrastructure/shared/constants';
import { StockMonthWasOpened } from '../../domain/aggregates/stockMonth/events/stockMonthWasOpened';
import { StockMonth } from '../../domain/aggregates/stockMonth/stockMonth';
import { STORAGE } from '../../../infrastructure/shared/contexts';
import { StockItem } from '../../domain/aggregates/stockMonth/stockItem';
import { assertItemIdsAreUnique } from '../../domain/aggregates/stockMonth/utils/asserts/assertItemIdsAreUnique';

@Injectable()
export class OpenStockMonthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly random: RandomService,
    private readonly time: TimeService,
    private readonly repo: StockMonthEventRepository,
  ) {}

  async runTransaction(
    dto: OpenStockMonthDto,
  ): Promise<OpenStockMonthResponseDto> {
    return this.dataSource.transaction('SERIALIZABLE', (transaction) => {
      return this.openStockMonth(dto, transaction);
    });
  }

  async openStockMonth(
    dto: OpenStockMonthDto,
    transaction: EntityManager,
  ): Promise<OpenStockMonthResponseDto> {
    const now = this.time.now();
    const monthCode = nowToMonthCode(now);
    const aggregateId = `${dto.locationId}_${monthCode}`;
    const eventId = this.random.uuid();

    await this.assertStockMonthIsNotAlreadyOpened(aggregateId, transaction);
    assertItemIdsAreUnique(dto);

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

    await this.repo.save(event, transaction);

    return OpenStockMonthResponseDto.from(aggregateId);
  }

  private async assertStockMonthIsNotAlreadyOpened(
    aggregateId: string,
    transaction: EntityManager,
  ): Promise<void> {
    const existingEvent = await this.repo.findOneByAggregateId(
      aggregateId,
      transaction,
    );
    if (existingEvent) {
      throw new BadRequestException(STOCK_MONTH_IS_ALREADY_OPENED);
    }
  }
}