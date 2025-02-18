import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { OpenStockMonthDto } from './dto/commands/openStockMonth/openStockMonth.dto';
import { OpenStockMonthResponseDto } from './dto/commands/openStockMonth/openStockMonthResponse.dto';
import { OpenStockMonthCommandHandler } from './commandHandlers/openStockMonthCommandHandler.service';
import { AddReceivedItemsDto } from './dto/commands/addReceivedItems.ts/addReceivedItems.dto';
import { AddReceivedItemsResponseDto } from './dto/commands/addReceivedItems.ts/addReceivedItemsResponse.dto';
import { AddReceivedItemsCommandHandler } from './commandHandlers/addReceivedItemsCommandHandler.service';
import { RemoveShippedItemsDto } from './dto/commands/removeShippedItems/removeShippedItems.dto';
import { RemoveShippedItemsResponseDto } from './dto/commands/removeShippedItems/removeShippedItemsResponse.dto';
import { RemoveShippedItemsCommandHandler } from './commandHandlers/removeShippedItemsCommandHandler.service';
import { AdjustInventoryDto } from './dto/commands/adjustInventory/adjustInventory.dto';
import { AdjustInventoryResponseDto } from './dto/commands/adjustInventory/adjustInventoryResponse.dto';
import { AdjustInventoryCommandHandler } from './commandHandlers/adjustInventoryCommandHandler.service';
import { GetStockItemsDto } from './dto/query/getStockItems/getStockItems.dto';
import { GetStockItemsResponseDto } from './dto/query/getStockItems/getStockItemsResponse.dto';
import { GetStockItemsService } from './queries/getStockItems.service';
import { Ctx, EventPattern, KafkaContext } from '@nestjs/microservices';
import { config } from '../../../infrastructure/config/config';
import { plainToInstance } from 'class-transformer';
import { IHeaders } from 'kafkajs';
import { MessageHeadersDto } from './dto/messages/messageHeaders.dto';
import { validate } from 'class-validator';
import { assertIsNotEmpty } from '../../../infrastructure/shared/assertIsNotEmpty';
import { StockProjectionsService } from './projections/stockProjections.service';
import { inspect } from 'util';

@Controller('storage/stock-month')
@ApiTags('storage/stock-month')
export class StockMonthController {
  constructor(
    private readonly getStockItemsService: GetStockItemsService,
    private readonly openStockMonthService: OpenStockMonthCommandHandler,
    private readonly addReceivedItemsService: AddReceivedItemsCommandHandler,
    private readonly removeShippedItemsService: RemoveShippedItemsCommandHandler,
    private readonly adjustInventoryService: AdjustInventoryCommandHandler,
    private readonly stockProjectionsService: StockProjectionsService,
  ) {}

  @Post('/get-stock-items')
  @ApiResponse({ type: GetStockItemsResponseDto })
  async getStockItems(
    @Body() dto: GetStockItemsDto,
  ): Promise<GetStockItemsResponseDto> {
    return this.getStockItemsService.getStockItems(dto);
  }

  @Post('/open')
  @ApiResponse({ type: OpenStockMonthResponseDto })
  async openStockMonth(@Body() body: OpenStockMonthDto) {
    return this.openStockMonthService.openStockMonth(body);
  }

  @Post('/add-received-items')
  @ApiResponse({ type: AddReceivedItemsResponseDto })
  async addReceivedItems(@Body() body: AddReceivedItemsDto) {
    return this.addReceivedItemsService.addReceivedItems(body);
  }

  @Post('/remove-shipped-items')
  @ApiResponse({ type: RemoveShippedItemsResponseDto })
  async removeShippedItems(
    @Body() body: RemoveShippedItemsDto,
  ): Promise<RemoveShippedItemsResponseDto> {
    return this.removeShippedItemsService.removeShippedItems(body);
  }

  @Post('/adjust-inventory')
  async adjustInventory(
    @Body() body: AdjustInventoryDto,
  ): Promise<AdjustInventoryResponseDto> {
    return this.adjustInventoryService.adjustInventory(body);
  }

  @EventPattern(config.kafka.kafkaStockEventsTopic)
  async projectStock(@Ctx() context: KafkaContext): Promise<void> {
    try {
      const message = context.getMessage();
      const headers = await this.validateHeaders(message.headers);
      const value = this.convertBufferToPlain(message.value);
      return this.stockProjectionsService.project(headers, value);
    } catch (error) {
      console.log(inspect({ error }, { depth: 15 }));
    }
  }

  private async validateHeaders(
    headerBuffers: IHeaders | undefined,
  ): Promise<MessageHeadersDto> {
    const plainHeaders = this.headerBuffersToPlain(headerBuffers);
    const headers = plainToInstance(MessageHeadersDto, plainHeaders);
    const errors = await validate(headers);

    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }

    return headers;
  }

  private headerBuffersToPlain(headerBuffers: IHeaders | undefined): {
    [key: string]: string | unknown;
  } {
    assertIsNotEmpty(headerBuffers);
    const plainHeaders: { [key: string]: string | unknown } = {};

    for (const key in headerBuffers) {
      if (Buffer.isBuffer(headerBuffers[key])) {
        plainHeaders[key] = (headerBuffers[key] as Buffer).toString();
      } else {
        plainHeaders[key] = headerBuffers[key];
      }
    }

    return plainHeaders;
  }

  private convertBufferToPlain(valueBuffer: Buffer | null): {
    [key: string]: any;
  } {
    assertIsNotEmpty(valueBuffer);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return JSON.parse(valueBuffer.payload);
  }
}
