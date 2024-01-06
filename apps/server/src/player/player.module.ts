import {Module} from '@nestjs/common';
import {PlayerService} from './player.service';
import {PlayerController} from './player.controller';
import {CacheService} from "../redis/cache.service";
import {RedisModule} from "../redis/redis.module";

@Module({
    controllers: [PlayerController],
    providers: [PlayerService],
})
export class PlayerModule {
}
