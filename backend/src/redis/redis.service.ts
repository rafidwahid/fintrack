import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import { Logger } from '@nestjs/common';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: RedisClientType;
  private isConnected = false;

  constructor(private configService: ConfigService) {
    this.client = createClient({
      socket: {
        host: this.configService.get('redis.host'),
        port: this.configService.get('redis.port'),
        reconnectStrategy: (retries) => {
          const retryAttempts = this.configService.get('redis.retryAttempts');
          const retryDelay = this.configService.get('redis.retryDelay');

          if (retries >= retryAttempts) {
            this.logger.error(`Max retry attempts (${retryAttempts}) reached`);
            return new Error('Max retry attempts reached');
          }

          this.logger.warn(`Retrying connection... Attempt ${retries + 1}`);
          return retryDelay;
        },
      },
      password: this.configService.get('redis.password'),
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.client.on('connect', () => {
      this.logger.log('Redis client connecting');
    });

    this.client.on('ready', () => {
      this.isConnected = true;
      this.logger.log('Redis client connected and ready');
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis client error:', err);
    });

    this.client.on('end', () => {
      this.isConnected = false;
      this.logger.warn('Redis client disconnected');
    });
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  async connect() {
    if (!this.isConnected) {
      try {
        await this.client.connect();
      } catch (err) {
        this.logger.error('Failed to connect to Redis:', err);
        throw err;
      }
    }
  }

  async disconnect() {
    if (this.isConnected) {
      try {
        await this.client.quit();
        this.isConnected = false;
      } catch (err) {
        this.logger.error('Failed to disconnect from Redis:', err);
        throw err;
      }
    }
  }

  getClient(): RedisClientType {
    if (!this.isConnected) {
      throw new Error('Redis client is not connected');
    }
    return this.client;
  }

  async set(key: string, value: string, ttl?: number) {
    const options: any = {};
    if (ttl) {
      options.EX = ttl;
    }
    return await this.client.set(key, value, options);
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async del(key: string): Promise<number> {
    return await this.client.del(key);
  }
}
