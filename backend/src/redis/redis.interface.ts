export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  ttl: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface RedisModuleOptions {
  config: RedisConfig;
}
