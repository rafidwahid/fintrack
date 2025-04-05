import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    // return this.transactionsService.create(createTransactionDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(id);
  }

  @Get('categories/all')
  getCategories() {
    return this.transactionsService.getCategories();
  }

  @Post('categories')
  addCategory(@Body('category') category: string) {
    return this.transactionsService.addCategory(category);
  }

  // @Put(':id/category')
  @Patch(':id/category')
  updateCategory(@Param('id') id: string, @Body('category') category: string) {
    return this.transactionsService.updateTransactionCategory(id, category);
  }
}
