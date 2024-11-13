import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OpenStockMonthDto } from './dto/openStockMonth.dto';

@Controller('storage/stock-month')
@ApiTags('storage/stock-month')
export class StockMonthController {
  @Post('/open')
  async openStockMonth(@Body() body: OpenStockMonthDto) {
    return { body };
  }
}
