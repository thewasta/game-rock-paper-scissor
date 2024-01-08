import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {PlayerModule} from './player/player.module';
import {RedisModule} from './redis/redis.module';
import {GameModule} from './game/game.module';
import {RequestTraceMiddleware} from "./middleware/requestTraceMiddleware";

@Module({
    imports: [RedisModule, PlayerModule, GameModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(RequestTraceMiddleware).forRoutes('*');
    }
}
