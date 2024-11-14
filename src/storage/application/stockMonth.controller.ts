import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { OpenStockMonthDto } from './dto/openStockMonth/openStockMonth.dto';
import { OpenStockMonthResponseDto } from './dto/openStockMonth/openStockMonthResponse.dto';
import { OpenStockMonthService } from './services/openStockMonth.service';

@Controller('storage/stock-month')
@ApiTags('storage/stock-month')
export class StockMonthController {
  constructor(private readonly openStockMonthService: OpenStockMonthService) {}

  @Post('/open')
  @ApiResponse({ type: OpenStockMonthResponseDto })
  async openStockMonth(@Body() body: OpenStockMonthDto) {
    return this.openStockMonthService.runTransaction(body);
  }
}
