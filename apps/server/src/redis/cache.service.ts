import {Inject, Injectable} from '@nestjs/common';
import {Redis} from 'ioredis';

@Injectable()
export class CacheService {
    constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {
    }

    async getFromKey<T>(key: string): Promise<T | null> {
        const redisResponse = await this.redisClient.get(key);
        if (redisResponse) {
            if (`/${key}/`.match("players:socket")) {
                console.log(redisResponse)
            }
            return JSON.parse(redisResponse) as T;
        }
        return null;
    }

    async delete<T>(key: string): Promise<void> {
        await this.redisClient.del(key);
    }

    async getFromBranch<T>(branch: string): Promise<T[]> {
        const keys = await this.redisClient.keys(`${branch}*`);
        if (keys.length > 0) {
            const results = await this.redisClient.mget(keys);
            return results.map(result => JSON.parse(result));
        }
        return [];
    }

    async setCache<T>(key: string, value: any): Promise<T> {
        await this.redisClient.set(key, JSON.stringify(value));
        return this.getFromKey(key);
    }
}
