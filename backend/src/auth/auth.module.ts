import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { SessionSerializer } from './utils/Serializer';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './utils/GoogleStrategy';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, PrismaModule],
  providers: [
    AuthService,
    GoogleStrategy,
    SessionSerializer,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
