import {Inject, Injectable} from '@nestjs/common';
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager"
import {Player} from "./entities/player.entity";

@Injectable()
export class PlayerService {
    constructor(@Inject(CACHE_MANAGER) private cache: Cache) {
    }

    async findOne(id: number): Promise<Player> {
        const redisKey = `players:${id}`;
        let player: Player = await this.cache.get(redisKey);
        if (!player) {
            player = {total: 0, wins: 0, createdAt: new Date()}
            await this.cache.set<Player>(redisKey, player);
        }
        return player;
    }
}
