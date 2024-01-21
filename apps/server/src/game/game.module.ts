import {Module} from '@nestjs/common';
import {GameService} from './game.service';
import {GameGateway} from './game.gateway';
import {RoomService} from "./room.service";

@Module({
    providers: [
        GameGateway,
        GameService,
        RoomService
    ],
})
export class GameModule {
}
