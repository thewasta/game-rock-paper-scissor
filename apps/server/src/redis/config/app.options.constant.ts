import Redis from 'ioredis';
import {RedisOptions} from 'ioredis';
import * as process from "process";

const REDIS_URL = process.env.REDIS_SERVER
export const redisConfig: RedisOptions = {
    host: 'localhost',
    port: 6379,
    username: 'default',
    password: 'secret',
};

let RedisClient: Redis;
if (REDIS_URL) {
    RedisClient = new Redis(REDIS_URL);
} else {
    RedisClient = new Redis(redisConfig);
}

export default RedisClient
