import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  async createCard(data: {
    lastFour: string;
    cardIssuer: string;
    passcode?: string;
    bankId: number;
    cardDesignId?: number;
    variant?: string;
    userId: number;
  }) {
    return this.prisma.card.create({
      data,
      include: {
        bank: true,
        cardDesign: true,
      },
    });
  }

  async findAllCards(userId: number) {
    return this.prisma.card.findMany({
      where: { userId },
      include: {
        bank: true,
        cardDesign: true,
      },
    });
  }

  async findCardById(id: number, userId: number) {
    const card = await this.prisma.card.findUnique({
      where: { id },
      include: {
        bank: true,
        cardDesign: true,
        statements: true,
      },
    });

    if (!card) {
      return null;
    }

    // Verify the card belongs to the user
    if (card.userId !== userId) {
      throw new ForbiddenException('Access to this card is forbidden');
    }

    return card;
  }

  async updateCard(
    id: number,
    updateData: {
      lastFour?: string;
      cardIssuer?: string;
      passcode?: string;
      bankId?: number;
      cardDesignId?: number;
      variant?: string;
      statementDate?: Date;
      notificationDate?: Date;
    },
    userId: number,
  ) {
    // First check if the card exists and belongs to the user
    const card = await this.prisma.card.findUnique({
      where: { id },
    });

    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }

    if (card.userId !== userId) {
      throw new ForbiddenException('Access to this card is forbidden');
    }

    return this.prisma.card.update({
      where: { id },
      data: updateData,
      include: {
        bank: true,
        cardDesign: true,
      },
    });
  }

  async deleteCard(id: number, userId: number) {
    // First check if the card exists and belongs to the user
    const card = await this.prisma.card.findUnique({
      where: { id },
    });

    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }

    if (card.userId !== userId) {
      throw new ForbiddenException('Access to this card is forbidden');
    }

    return this.prisma.card.delete({
      where: { id },
    });
  }
}
