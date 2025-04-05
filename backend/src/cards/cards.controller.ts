import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CardsService } from './cards.service';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  async addCard(
    @Body()
    cardData: {
      lastFour: string;
      cardIssuer: string;
      passcode: string;
      bankId: number;
      cardDesignId?: number;
      variant?: string;
    },
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.cardsService.createCard({ ...cardData, userId });
  }

  @Get()
  async getAllCards(@Req() req) {
    const userId = req.user.id;
    return this.cardsService.findAllCards(userId);
  }

  @Get(':id')
  async getCard(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = req.user.id;
    const card = await this.cardsService.findCardById(id, userId);

    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }

    return card;
  }

  @Put(':id')
  async updateCard(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateData: {
      lastFour?: string;
      cardIssuer?: string;
      passcode?: string;
      bankId?: number;
      cardDesignId?: number;
      variant?: string;
      statementDate?: Date;
      notificationDate?: Date;
      dueDate?: Date;
      minimumPayment?: number;
      currentBalance?: number;
    },
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.cardsService.updateCard(id, updateData, userId);
  }

  @Delete(':id')
  async deleteCard(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = req.user.id;
    return this.cardsService.deleteCard(id, userId);
  }
}
