import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from './redis.service';
import redisConfig from './redis.config';

@Module({})
export class RedisModule {
  static forRoot(): DynamicModule {
    return {
      module: RedisModule,
      imports: [ConfigModule.forFeature(redisConfig)],
      providers: [RedisService],
      exports: [RedisService],
      global: true,
    };
  }
}
