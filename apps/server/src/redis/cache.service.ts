import {Inject, Injectable} from "@nestjs/common";
import {Redis} from "ioredis";

@Injectable()
export class CacheService {
    constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {
    }

    async getFromKey<T>(key: string): Promise<T | null> {
        const redisResponse = await this.redisClient.get(key);
        if (redisResponse) {
            return JSON.parse(redisResponse) as T;
        }
        return null;
    }

    async setCache<T>(key: string, value: any): Promise<T> {
        await this.redisClient.set(key, JSON.stringify(value));
        return this.getFromKey(key)
    }
}