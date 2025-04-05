import { Module } from '@nestjs/common';
import { StatementsService } from './statements.service';
import { StatementsController } from './statements.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CardsModule } from 'src/cards/cards.module';
import { CardsService } from 'src/cards/cards.service';

@Module({
  imports: [PrismaModule, CardsModule],
  controllers: [StatementsController],
  providers: [StatementsService, CardsService],
})
export class StatementsModule {}
