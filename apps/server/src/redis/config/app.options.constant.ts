import Redis from 'ioredis';
import { RedisOptions } from 'ioredis';

export const redisConfig: RedisOptions = {
  host: 'localhost',
  port: 6379,
  username: 'default',
  password: 'secret',
};

export const RedisClient = new Redis(redisConfig);
