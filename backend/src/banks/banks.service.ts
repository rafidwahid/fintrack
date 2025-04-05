import { Injectable } from '@nestjs/common';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { PrismaService } from '../prisma/prisma.service';

// Define Bank interface based on schema

@Injectable()
export class BanksService {
  constructor(private prisma: PrismaService) {}

  create(createBankDto: CreateBankDto) {
    return 'This action adds a new bank';
  }

  async findAll() {
    return await this.prisma.bank.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    // Return first result or null if not found
    return 'a';
  }

  update(id: number, updateBankDto: UpdateBankDto) {
    return `This action updates a #${id} bank`;
  }

  remove(id: number) {
    return `This action removes a #${id} bank`;
  }
}
