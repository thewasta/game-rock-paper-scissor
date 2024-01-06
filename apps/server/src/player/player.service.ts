import {Inject, Injectable} from '@nestjs/common';
import {Player} from "./entities/player.entity";
import {Redis} from 'ioredis';
import {CacheService} from "../redis/cache.service";

@Injectable()
export class PlayerService {
    constructor(private readonly cacheService: CacheService) {
    }

    async findOne(id: number): Promise<Player> {
        const redisKey = `players:${id}`;
        let player = await this.cacheService.getFromKey<Player>(redisKey);
        if (!player) {
            player = {total: 0, wins: 0, createdAt: new Date()}
            await this.cacheService.setCache<Player>(redisKey, player);
        }
        return player;
    }
}
