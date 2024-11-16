import { OpenStockMonthDto } from '../../../../../application/dto/openStockMonth/openStockMonth.dto';
import { BadRequestException } from '@nestjs/common';
import { ITEMS_MUST_HAVE_UNIQUE_UUIDS } from '../../../../../../infrastructure/shared/errorMessages';

export const assertItemIdsAreUnique = (
  dto: Pick<OpenStockMonthDto, 'items'>,
) => {
  const itemIds = dto.items.map((item) => item.id);
  const uniqueItemIds = new Set(itemIds);
  if (uniqueItemIds.size !== itemIds.length) {
    throw new BadRequestException(ITEMS_MUST_HAVE_UNIQUE_UUIDS);
  }
};
