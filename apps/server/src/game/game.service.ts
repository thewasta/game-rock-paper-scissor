import {Inject, Injectable} from '@nestjs/common';
import {UpdateGameDto} from './dto/update-game.dto';
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {GameDto} from "./dto/game.dto";
import {CacheService} from "../redis/cache.service";

@Injectable()
export class GameService {
    constructor(private readonly cacheService: CacheService) {
    }

    async create(createGameDto: GameDto): Promise<GameDto> {
        return await this.cacheService.setCache(`games:inProgress:${createGameDto.gameId}`, createGameDto);
    }

    async joinGame(playerId: string, gameId: string) {
        const game = await this.cacheService.getFromKey<GameDto>(`games:inProgress:${gameId}`);
        await this.cacheService.setCache<GameDto>(`games:inProgress:${gameId}`, {
            ...game,
            playerTwo: playerId
        });

        return gameId;
    }

    async findOne(playerId: string, gameId: string) {
        const searchGame = await this.cacheService.getFromKey(`games:inProgress*`);
        console.log(searchGame);
        // Check if in progress games are available, if not create a new game
        if (!searchGame) {
            await this.create({
                playerOne: playerId,
                gameId: gameId,
                playing: false,
                finished: false,
                playerTwo: null,
                rounds: [],
                won: null,
                startedBy: playerId
            });
            console.log("Room created");
            // room id will be the game id from the first user
            return gameId;
        } else {
            console.log("Joined to existed game");
            // const randomElement = searchGame[Math.floor(Math.random() * searchGame.length)];
            //
            // return await this.joinGame(playerId, randomElement.gameId);
        }
    }

    update(id: number, updateGameDto: UpdateGameDto) {
        return `This action updates a #${id} game`;
    }

    finish(playerOne: string, playerTwo: string, playerWon: string) {
        return `This action removes a #${playerOne} game`;
    }
}
