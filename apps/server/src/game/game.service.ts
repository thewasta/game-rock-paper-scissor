import {Inject, Injectable} from '@nestjs/common';
import {UpdateGameDto} from './dto/update-game.dto';
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager";
import {GameDto} from "./dto/game.dto";

@Injectable()
export class GameService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    }

    async create(createGameDto: GameDto): Promise<GameDto> {
        return await this.cacheManager.set(`games:inProgress:${createGameDto.gameId}`, createGameDto);
    }

    async joinGame(playerId: string, gameId: string) {
        const game = await this.cacheManager.get<GameDto>(`games:inProgress:${gameId}`);
        await this.cacheManager.set<GameDto>(`games:inProgress:${gameId}`, {
            ...game,
            playerTwo: playerId
        });

        return gameId;
    }

    async findOne(playerId: string, gameId: string) {
        const searchGame = this.cacheManager.get(`games:inProgress*`);
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
