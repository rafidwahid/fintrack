import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDetails } from './utils/types';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUser(details: UserDetails) {
    const user = await this.prisma.user.findUnique({
      where: { email: details.email },
    });

    if (user) return user;

    return this.prisma.user.create({
      data: {
        email: details.email,
        firstName: details.firstName,
        lastName: details.lastName,
        googleId: details.googleId,
      },
    });
  }

  async findUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user;
  }
}
