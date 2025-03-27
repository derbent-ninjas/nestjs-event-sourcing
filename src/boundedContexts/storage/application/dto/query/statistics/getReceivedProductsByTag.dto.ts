import { TagTypesEnum } from '../../../shared/enums/tagTypes.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class GetReceivedProductsByTagDto {
  @ApiProperty()
  @IsEnum(TagTypesEnum)
  @ApiProperty()
  tag!: TagTypesEnum;
}
