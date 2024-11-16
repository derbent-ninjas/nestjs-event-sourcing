import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { OpenStockMonthDto } from './dto/openStockMonth/openStockMonth.dto';
import { OpenStockMonthResponseDto } from './dto/openStockMonth/openStockMonthResponse.dto';
import { OpenStockMonthService } from './services/openStockMonth.service';
import { AddReceivedItemsDto } from './dto/addReceivedItems.ts/addReceivedItems.dto';
import { AddReceivedItemsResponseDto } from './dto/addReceivedItems.ts/addReceivedItemsResponse.dto';
import { AddReceivedItemsService } from './services/addReceivedItems.service';

@Controller('storage/stock-month')
@ApiTags('storage/stock-month')
export class StockMonthController {
  constructor(
    private readonly openStockMonthService: OpenStockMonthService,
    private readonly addReceivedItemsService: AddReceivedItemsService,
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
}
