import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerModule } from './player/player.module';
import { RedisModule } from './redis/redis.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [RedisModule, PlayerModule, GameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
