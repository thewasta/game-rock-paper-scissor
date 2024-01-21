import {ActionType} from "../model/actionType";

export class RoundGameDto {
    gameId: string;
    player: string;
    action: ActionType;
}