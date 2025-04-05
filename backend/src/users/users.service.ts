import { Injectable } from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(userData: { googleId: string; email: string; name: string }) {
    return this.prisma.user.create({
      data: {
        googleId: userData.googleId,
        email: userData.email,
        firstName: userData.name,
      },
    });
  }

  async findByGoogleId(googleId: string) {
    return this.prisma.user.findFirst({
      where: {
        googleId,
      },
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
