import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.transaction.findMany();
  }

  async findOne(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: parseInt(id) },
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  // async create(createTransactionDto: CreateTransactionDto) {
  //   return this.prisma.transaction.create({
  //     data: {
  //       ...createTransactionDto,
  //       cardId: parseInt(createTransactionDto.cardId),
  //       amount: parseFloat(createTransactionDto.amount.toString()),
  //       date: new Date(createTransactionDto.date),
  //     },
  //   });
  // }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    try {
      return await this.prisma.transaction.update({
        where: { id: parseInt(id) },
        data: {
          ...updateTransactionDto,
          cardId: updateTransactionDto.cardId
            ? parseInt(updateTransactionDto.cardId)
            : undefined,
          amount: updateTransactionDto.amount
            ? parseFloat(updateTransactionDto.amount.toString())
            : undefined,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.transaction.delete({
        where: { id: parseInt(id) },
      });
    } catch (error) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
  }

  async getCategories() {
    const transactions = await this.prisma.transaction.findMany({
      select: { category: true },
      distinct: ['category'],
    });
    return transactions.map((t) => t.category).filter(Boolean);
  }

  async addCategory(category: string) {
    // This is a no-op since categories are stored with transactions
    return [category];
  }

  async updateTransactionCategory(id: string, category: string) {
    try {
      // First get the transaction to find its description
      const transaction = await this.prisma.transaction.findUnique({
        where: { id: parseInt(id) },
      });

      if (!transaction) {
        throw new NotFoundException(`Transaction with ID ${id} not found`);
      }

      // Update all transactions with the same description
      const updatedTransactions = await this.prisma.transaction.updateMany({
        where: {
          description: transaction.description,
        },
        data: { category },
      });

      // Return the original transaction with updated category
      return {
        ...transaction,
        category,
      };
    } catch (error) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
  }
}
