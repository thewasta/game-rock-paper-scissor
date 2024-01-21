import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {PlayerModule} from './player/player.module';
import {RedisModule} from './redis/redis.module';
import {GameModule} from './game/game.module';
import {RequestTraceMiddleware} from "./middleware/requestTraceMiddleware";
import {ConfigModule} from '@nestjs/config';
import {ServeStaticModule} from "@nestjs/serve-static";
import {join} from "path";

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', '..', 'client', 'dist'),
            exclude: ['/api/(.*)'],
        }),
        ConfigModule.forRoot(), RedisModule, PlayerModule, GameModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(RequestTraceMiddleware).forRoutes('*');
    }
}
