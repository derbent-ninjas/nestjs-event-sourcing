import { ApiProperty } from '@nestjs/swagger';
import { QueriedPoint } from '../../../queries/statisticsRead.service';

class PieChartPoint {
  @ApiProperty()
  label!: string;

  @ApiProperty()
  value!: number;

}

export class GetReceivedProductsByTemperatureModeResponseDto {
  @ApiProperty({ type: [PieChartPoint] })
  graphData!: PieChartPoint[];

  @ApiProperty()
  total!: number;

  static from(queriedPoints: QueriedPoint[]): GetReceivedProductsByTemperatureModeResponseDto {
    const dto = new GetReceivedProductsByTemperatureModeResponseDto();

    dto.graphData = queriedPoints.map(p => ({
      label: p.temperatureMode,
      value: p._value,
    }))
    dto.total = queriedPoints.reduce((acc, el) => acc + el._value, 0);

    return dto;
  }
}
