export type GameActions = "ROCK" | "PAPER" | "SCISSOR"

interface GameRound {
    round: number;
    playerOne: GameActions;
    playerTwo: GameActions;
    winner: string;
}

export class GameDto {
    gameId: string;
    playerOne?: string;
    playerTwo: string;
    startedBy: string;
    won?: string;
    rounds: GameRound[];
    finished: boolean;
    playing: boolean;
}