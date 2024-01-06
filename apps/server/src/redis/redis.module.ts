import {Module} from '@nestjs/common';
import {CacheModule} from "@nestjs/cache-manager";
import {RedisOptions} from "./config/app.options.constant";

@Module({
    imports: [
        CacheModule.registerAsync(RedisOptions)
    ],
})
export class RedisModule {
}
