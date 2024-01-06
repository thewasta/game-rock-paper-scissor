import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Observable} from "rxjs";
import {CacheService} from "../redis/cache.service";
import {Socket} from "socket.io";
import {GameDto} from "./dto/game.dto";

@Injectable()
export class GameGuard implements CanActivate {

    constructor(private readonly cacheService: CacheService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client = context.switchToWs().getClient<Socket>();
        const cookies = client.handshake.headers.cookie;
        if (!cookies) {
            client.emit("unauthorized", "Cookie not provided");
            return false;
        }
        const splitCookies = cookies.split("; ")
        const userSessionCookie = splitCookies.find(cookie => cookie.startsWith('rps-game')).split('=')[1];
        if (!userSessionCookie) {
            client.emit("unauthorized", "Cookie not provided");
            return false;
        }
        const gamesInProgress: GameDto[] = await this.cacheService.getFromBranch(`games:inProgress:`);

        const currentGames = gamesInProgress.filter(game => {
            return game.playerOne === userSessionCookie || game.playerTwo === userSessionCookie
        })
        if (currentGames.length) {
            client.emit("unauthorized", "You are already in a game");
            return false;
        }
        if (client.rooms.size > 1) {
            client.emit("unauthorized", "You are already in a room");
            return false;
        }
        return true;
    }
}