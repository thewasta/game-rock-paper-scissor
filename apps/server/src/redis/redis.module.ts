import { Global, Module } from '@nestjs/common';
import { RedisClient } from './config/app.options.constant';
import { CacheService } from './cache.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useValue: RedisClient,
    },
    CacheService,
  ],
  exports: [CacheService],
})
export class RedisModule {}
