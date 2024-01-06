import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    ConnectedSocket,
    WsResponse, OnGatewayInit
} from '@nestjs/websockets';
import {GameService} from './game.service';
import {FindGameDto} from './dto/find-game.dto';
import {FinishGameDto} from "./dto/finish-game.dto";
import {Server, Socket} from "socket.io";
import {OnModuleInit} from "@nestjs/common";
import {from, map, Observable} from "rxjs";
import {json, raw} from "express";

@WebSocketGateway()
export class GameGateway implements OnGatewayInit {

    @WebSocketServer()
    private server: Server;

    constructor(private readonly gameService: GameService) {
    }

    afterInit(client: Socket): any {
        console.log("New client connected: ", client.id);
    }

    onModuleInit(): any {
        const self = this;
        this.server.on("connection", (client: Socket) => {
            client.on("disconnect", () => {
                console.log("CLIENT DISCONNECTED")
            })
        });
    }

    //region User Count Events
    @SubscribeMessage("disconnect")
    disconnected() {
        console.log("DISCONNECT")
        const totalConnections = this.server.engine.clientsCount;
        this.server.emit("user count", totalConnections)
    }

    @SubscribeMessage("user count")
    userCount() {
        const totalConnections = this.server.engine.clientsCount;
        this.server.emit("user count", totalConnections)
    }

    //endregion
    @SubscribeMessage('find game')
    async findOne(@MessageBody() findGameDto: string, @ConnectedSocket() client: Socket) {
        const parser: FindGameDto = JSON.parse(findGameDto)
        const gameId = await this.gameService.findOne(parser.playerId, parser.gameId)
        client.join("gameId");
        this.server.to("gameId").emit("joined", `Welcome to room ${gameId}`)
    }

    @SubscribeMessage('finish game')
    remove(@MessageBody() finishGameDto: FinishGameDto) {
        return this.gameService.finish(finishGameDto.playerOne, finishGameDto.playerTwo, finishGameDto.won);
    }

    @SubscribeMessage('start game')
    start(@ConnectedSocket() client: Socket){

        console.log(client.rooms);
        return "HOLA";
    }
}
