import {Injectable, Logger} from '@nestjs/common';
import {UpdateGameDto} from './dto/update-game.dto';
import {GameDto} from './dto/game.dto';
import {CacheService} from '../redis/cache.service';
import {raw} from "express";
import {readableStreamLikeToAsyncGenerator} from "rxjs/internal/util/isReadableStreamLike";
import {Player} from "../player/entities/player.entity";
import {PlayerAlreadyConnected} from "./exception/player-already.connected";

interface PlayerSocketDTO {
    socket: string,
    createdAt: string
}

@Injectable()
export class GameService {
    constructor(private readonly cacheService: CacheService) {
    }

    async create(createGameDto: GameDto): Promise<GameDto> {
        return await this.cacheService.setCache(
            `games:inProgress:${createGameDto.gameId}`,
            createGameDto,
        );
    }

    async joinGame(playerId: string, gameId: string) {
        const game = await this.cacheService.getFromKey<GameDto>(
            `games:inProgress:${gameId}`,
        );
        await this.cacheService.setCache<GameDto>(`games:inProgress:${gameId}`, {
            ...game,
            playerTwo: playerId,
        });

        return gameId;
    }

    async findGame(gameId: string): Promise<GameDto> {
        return this.cacheService.getFromKey(`games:inProgress:${gameId}`);
    }

    async findOne(playerId: string, gameId: string): Promise<GameDto> {
        const searchGame: GameDto[] = await this.cacheService.getFromBranch("games:inProgress:");
        // Check if in progress games are available, if not create a new game
        if (searchGame.length === 0) {
            const newGame = {
                playerOne: playerId,
                gameId: gameId,
                playing: false,
                finished: false,
                playerTwo: null,
                rounds: [],
                won: null,
                startedBy: playerId,
            }
            await this.create(newGame);
            // room id will be the game id from the first user
            return newGame;
        } else {
            const randomElement = searchGame[Math.floor(Math.random() * searchGame.length)];
            await this.joinGame(playerId, randomElement.gameId);
            return {
                ...randomElement,
                playerTwo: playerId
            };
        }
    }

    async findPlayerSocket(cookie: string): Promise<string> {
        const socket = await this.cacheService.getFromKey<PlayerSocketDTO>(`players:socket:${cookie}`);
        return socket.socket
    }

    async playerDisconnection(cookie: string, socketId: string) {
        await this.cacheService.delete(`players:socket:${cookie}`);
        const playerStats = await this.cacheService.getFromKey<Player>(`players:stats:${cookie}`);
        playerStats.connected = false;
        await this.cacheService.setCache(`players:stats:${cookie}`, playerStats);
    }

    async playerConnection(cookie: string, socketId: string) {
        await this.cacheService.setCache(`players:socket:${cookie}`, {
            socket: socketId,
            createdAt: new Date()
        });
        const playerStats = await this.cacheService.getFromKey<Player>(`players:stats:${cookie}`);
        if (playerStats === null) {
            const stats: Player = {
                total: 0,
                wins: 0,
                draw: 0,
                connected: true,
                createdAt: new Date()
            }
            await this.cacheService.setCache(`players:stats:${cookie}`, stats);
            return;
        }
        // if (playerStats.connected) {
        //     throw new PlayerAlreadyConnected();
        // }
        playerStats.connected = true;
        await this.cacheService.setCache(`players:stats:${cookie}`, playerStats);
    }

    async quit(player: string, gameId: string) {
        const game = await this.cacheService.getFromKey(`games:inProgress:${gameId}`)
        if (!game) {
            throw new Error(`GAME NOT FOUND WITH ID ${gameId}`)
        }
        await this.cacheService.delete(`games:inProgress:${gameId}`);
    }

    async finish(gameId: string, winner: string) {
        try {
            const game: GameDto = await this.cacheService.getFromKey(`games:inProgress:${gameId}`);
            const playerOne = await this.cacheService.getFromKey<Player>(`players:stats:${game.playerOne}`);
            const playerTwo = await this.cacheService.getFromKey<Player>(`players:stats:${game.playerTwo}`);
            playerOne.total += 1;
            playerTwo.total += 1;
            await this.cacheService.delete(`games:inProgress:${gameId}`)
            if (winner === "DRAW") {
                playerOne.draw += 1;
                playerTwo.draw += 1;
            } else {
                const winner = await this.cacheService.getFromKey<Player>(`players:stats:${game.won}`)
                winner.wins += 1;
                await this.cacheService.setCache(`players:stats:${game.won}`, winner);
            }
            await this.cacheService.setCache(`players:stats:${game.playerOne}`, playerOne);
            await this.cacheService.setCache(`players:stats:${game.playerTwo}`, playerTwo);
            await this.cacheService.setCache(`games:finished:${gameId}`, game)
        } catch (e) {
            console.error(e);
        }
    }
}
