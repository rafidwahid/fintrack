import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CardsModule } from './cards/cards.module';
import { UploadsModule } from './uploads/uploads.module';
import { TransactionsModule } from './transactions/transactions.module';
import { PassportModule } from '@nestjs/passport';
import { BanksModule } from './banks/banks.module';
import { StatementsModule } from './statements/statements.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CardsModule,
    UploadsModule,
    TransactionsModule,
    PassportModule.register({ session: true }),
    BanksModule,
    StatementsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
