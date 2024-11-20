import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class MessageHeadersDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  messageId!: number;

  @IsNotEmpty()
  @IsString()
  eventId!: string;

  @IsNotEmpty()
  @IsString()
  eventName!: string;

  @IsNotEmpty()
  @IsString()
  aggregateId!: string;

  @IsNotEmpty()
  @IsString()
  aggregateName!: string;

  @IsNotEmpty()
  @IsString()
  contextName!: string;

  @IsOptional()
  @IsString()
  causationId!: string | null;

  @IsNotEmpty()
  @IsString()
  correlationId!: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  version!: number;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value / 1000), { toClassOnly: true })
  @IsDate()
  createdAt!: Date;
}
