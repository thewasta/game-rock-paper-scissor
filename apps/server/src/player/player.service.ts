import {Injectable} from '@nestjs/common';
import {Player} from './entities/player.entity';
import {CacheService} from '../redis/cache.service';

@Injectable()
export class PlayerService {
    constructor(private readonly cacheService: CacheService) {
    }

    async findOne(id: string): Promise<Player> {
        const redisKey = `players:stats:${id}`;
        let player = await this.cacheService.getFromKey<Player>(redisKey);
        if (!player) {
            player = {total: 0, wins: 0, createdAt: new Date(), connected: false, draw: 0};
            await this.cacheService.setCache<Player>(redisKey, player);
        }
        return player;
    }
}
