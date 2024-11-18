import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { OpenStockMonthDto } from './dto/openStockMonth/openStockMonth.dto';
import { OpenStockMonthResponseDto } from './dto/openStockMonth/openStockMonthResponse.dto';
import { OpenStockMonthService } from './services/openStockMonth.service';
import { AddReceivedItemsDto } from './dto/addReceivedItems.ts/addReceivedItems.dto';
import { AddReceivedItemsResponseDto } from './dto/addReceivedItems.ts/addReceivedItemsResponse.dto';
import { AddReceivedItemsService } from './services/addReceivedItems.service';
import { RemoveShippedItemsDto } from './dto/removeShippedItems/removeShippedItems.dto';
import { RemoveShippedItemsResponseDto } from './dto/removeShippedItems/removeShippedItemsResponse.dto';
import { RemoveShippedItemsService } from './services/removeShippedItems.service';
import { AdjustInventoryDto } from './dto/adjustInventory/adjustInventory.dto';
import { AdjustInventoryResponseDto } from './dto/adjustInventory/adjustInventoryResponse.dto';
import { AdjustInventoryService } from './services/adjustInventory.service';

@Controller('storage/stock-month')
@ApiTags('storage/stock-month')
export class StockMonthController {
  constructor(
    private readonly openStockMonthService: OpenStockMonthService,
    private readonly addReceivedItemsService: AddReceivedItemsService,
    private readonly removeShippedItemsService: RemoveShippedItemsService,
    private readonly adjustInventoryService: AdjustInventoryService,
  ) {}

  @Post('/open')
  @ApiResponse({ type: OpenStockMonthResponseDto })
  async openStockMonth(@Body() body: OpenStockMonthDto) {
    return this.openStockMonthService.runTransaction(body);
  }

  @Post('/add-received-items')
  @ApiResponse({ type: AddReceivedItemsResponseDto })
  async addReceivedItems(@Body() body: AddReceivedItemsDto) {
    return this.addReceivedItemsService.runTransaction(body);
  }

  @Post('/remove-shipped-items')
  @ApiResponse({ type: RemoveShippedItemsResponseDto })
  async removeShippedItems(
    @Body() body: RemoveShippedItemsDto,
  ): Promise<RemoveShippedItemsResponseDto> {
    return this.removeShippedItemsService.runTransaction(body);
  }

  @Post('/adjust-inventory')
  async adjustInventory(
    @Body() body: AdjustInventoryDto,
  ): Promise<AdjustInventoryResponseDto> {
    return this.adjustInventoryService.runTransaction(body);
  }
}
