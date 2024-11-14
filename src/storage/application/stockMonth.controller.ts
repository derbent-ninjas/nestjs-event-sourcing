import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { OpenStockMonthDto } from './dto/openStockMonth/openStockMonth.dto';
import { OpenStockMonthResponseDto } from './dto/openStockMonth/openStockMonthResponse.dto';

@Controller('storage/stock-month')
@ApiTags('storage/stock-month')
export class StockMonthController {
  @Post('/open')
  @ApiResponse({ type: OpenStockMonthResponseDto })
  async openStockMonth(@Body() body: OpenStockMonthDto) {
    return { body };
  }
}
