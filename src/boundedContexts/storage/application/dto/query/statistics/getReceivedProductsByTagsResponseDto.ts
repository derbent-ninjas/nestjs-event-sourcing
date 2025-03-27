import { ApiProperty } from '@nestjs/swagger';
import { QueriedPoint } from '../../../queries/statisticsRead.service';
import { TagTypesEnum } from '../../../shared/enums/tagTypes.enum';

class PieChartPoint {
  @ApiProperty()
  label!: string;

  @ApiProperty()
  value!: number;
}

export class GetReceivedProductsByTagsResponseDto {
  @ApiProperty({ type: [PieChartPoint] })
  graphData!: PieChartPoint[];

  @ApiProperty()
  total!: number;

  static from(tag: TagTypesEnum, queriedPoints: QueriedPoint[]): GetReceivedProductsByTagsResponseDto {
    const dto = new GetReceivedProductsByTagsResponseDto();

    dto.graphData = queriedPoints.map(p => ({
      label: p[tag],
      value: p._value,
    }))
    dto.total = queriedPoints.reduce((acc, el) => acc + el._value, 0);

    return dto;
  }
}
