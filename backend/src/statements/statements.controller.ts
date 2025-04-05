import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Param,
  Put,
  Patch,
  Delete,
  ParseIntPipe,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import { StatementsService } from './statements.service';
import { CreateStatementDto } from './dto/create-statement.dto';
import { UpdateStatementDto } from './dto/update-statement.dto';

@Controller('statements')
export class StatementsController {
  constructor(private readonly statementService: StatementsService) {}

  @Post()
  create(@Body() createStatementDto: CreateStatementDto) {
    return this.statementService.create(createStatementDto);
  }

  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    const userId = req.user.id;

    return await this.statementService.processStatement(id, userId, file);
  }

  @Post(':cardId/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadStatement(
    @Param('cardId', ParseIntPipe) cardId: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    return this.statementService.processStatementUpload(
      cardId,
      file,
      req.user.id,
    );
  }

  @Get()
  findAll(@Req() req) {
    return this.statementService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.statementService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStatementDto: UpdateStatementDto,
  ) {
    return this.statementService.update(+id, updateStatementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statementService.remove(+id);
  }
}
