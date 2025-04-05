import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StatementsService } from 'src/statements/statements.service';

@Module({
  imports: [PrismaModule],
  providers: [CardsService, StatementsService],
  controllers: [CardsController],
})
export class CardsModule {}
