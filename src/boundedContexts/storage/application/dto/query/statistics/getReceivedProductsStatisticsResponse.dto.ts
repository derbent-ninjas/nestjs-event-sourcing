import { ApiProperty } from '@nestjs/swagger';
import { QueriedPoint } from '../../../queries/statisticsRead.service';

class GraphPoint {
  @ApiProperty()
  x!: string;

  @ApiProperty()
  y!: number;
}

export class GetReceivedProductsStatisticsResponseDto {
  @ApiProperty({ type: [GraphPoint] })
  graphData!: GraphPoint[];

  static fromPoints(points: QueriedPoint[]) {
    const dto = new GetReceivedProductsStatisticsResponseDto();

    dto.graphData = points.map(p => ({
      x: p._time,
      y: p._value,
    }))

    return dto;
  }
}
