import {Injectable} from "@nestjs/common";
import {CacheService} from "../redis/cache.service";
import {ActionType} from "./model/actionType";
import {GameResultDto} from "./model/game.result.dto";
import {GameDto, GameRound} from "./dto/game.dto";
import {Game} from "./entities/game.entity";


type PLAYER_WHO_SENT_ACTION = "playerOne" | "playerTwo";
export type ROUND_RESULT = "FINISHED" | "PLAYING" | GameResultDto;


@Injectable()
export class RoomService {
    constructor(private readonly cacheService: CacheService) {
    }

    async determineGameResult(game: GameDto): Promise<void> {
        let playerOneWins = 0;
        let playerTwoWins = 0;
        for (const round of game.rounds) {
            const roundWinner = round.winner;
            if (roundWinner === "PLAYER_ONE_WINS") {
                playerOneWins++;
            } else if (roundWinner === "PLAYER_TWO_WINS") {
                playerTwoWins++
            }
        }

        if (playerOneWins >= 2) {
            game.won = game.playerOne;
            await this.cacheService.setCache(`games:inProgress:${game.gameId}`, game);
            return;
        } else if (playerTwoWins >= 2) {
            game.won = game.playerTwo
            await this.cacheService.setCache(`games:inProgress:${game.gameId}`, game);
        } else {
            game.won = "DRAW";
            await this.cacheService.setCache(`games:inProgress:${game.gameId}`, game);
        }
    }

    private determineWinner(playerOne: ActionType, playerTwo: ActionType): GameResultDto {
        if (playerOne === playerTwo) {
            return 'DRAW';
        }

        if (
            (playerOne === 'ROCK' && playerTwo === 'SCISSOR') ||
            (playerOne === 'PAPER' && playerTwo === 'ROCK') ||
            (playerOne === 'SCISSOR' && playerTwo === 'PAPER')
        ) {
            return 'PLAYER_ONE_WINS';
        }

        return 'PLAYER_TWO_WINS';
    }

    private determinePlayer(game: GameDto, player: string): PLAYER_WHO_SENT_ACTION {
        if (player === game.playerOne) {
            return "playerOne";
        } else {
            return "playerTwo";
        }
    }

    async action(player: string, gameId: string, action: ActionType): Promise<GameDto | string> {
        const game: GameDto = await this.cacheService.getFromKey(`games:inProgress:${gameId}`);
        let result = null;
        const whoAmI = this.determinePlayer(game, player);
        const roundsWithBothPlayers = game.rounds.filter(round => round.playerOne !== null && round.playerTwo !== null);
        if (game.rounds.length === 0 || roundsWithBothPlayers.length == game.rounds.length) {
            const newRound = {
                round: (game.rounds.length > 0 ? game.rounds[game.rounds.length - 1].round + 1 : 1),
                playerOne: null,
                playerTwo: null
            };
            newRound[whoAmI] = action;
            game.rounds.push(newRound);
            result = "WAIT";
        } else {
            let roundsWithPlayerAction = game.rounds.filter(round => round[whoAmI] === null);
            const latestRound = roundsWithPlayerAction[roundsWithPlayerAction.length - 1];
            latestRound[whoAmI] = action;
            latestRound["winner"] = this.determineWinner(latestRound.playerOne, latestRound.playerTwo);
            result = "NEXT";
        }
        if (game.rounds.length > 2 && game.rounds[game.rounds.length - 1]["playerTwo"] && game.rounds[game.rounds.length - 1]["playerTwo"]) {
            await this.determineGameResult(game);
            return "FINISHED";
        }
        game.rounds.sort((a, b) => a.round - b.round);
        await this.cacheService.setCache(`games:inProgress:${gameId}`, game);
        return result;
    }
}