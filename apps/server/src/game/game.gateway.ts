import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    ConnectedSocket,
    WsResponse,
    OnGatewayInit,
} from '@nestjs/websockets';
import {GameService} from './game.service';
import {FindGameDto} from './dto/find-game.dto';
import {FinishGameDto} from './dto/finish-game.dto';
import {Server, Socket} from 'socket.io';
import {OnModuleInit, UseGuards} from '@nestjs/common';
import {from, map, Observable} from 'rxjs';
import {json, raw} from 'express';
import {GameGuard} from "./game.guard";

@WebSocketGateway()
export class GameGateway implements OnModuleInit {
    @WebSocketServer()
    private server: Server;

    constructor(private readonly gameService: GameService) {
    }

    onModuleInit(): any {
        const self = this;
        this.server.on('connection', (client: Socket) => {
            console.log(`Client ${client.id} connected`);
            console.log(`Total: ${self.server.engine.clientsCount}`)
            self.server.sockets.emit('user count', self.server.engine.clientsCount);
            client.on('disconnect', () => {
                self.server.sockets.emit('user count', self.server.engine.clientsCount);
                console.log(`Total: ${self.server.engine.clientsCount}`)
                console.log('CLIENT DISCONNECTED');
            });
        });
    }

    @UseGuards(GameGuard)
    @SubscribeMessage('find game')
    async findOne(
        @MessageBody() findGameDto: string,
        @ConnectedSocket() client: Socket,
    ) {
        const parser: FindGameDto = JSON.parse(findGameDto);
        const game = await this.gameService.findOne(
            parser.playerId,
            parser.gameId,
        );
        client.join(game.gameId);
        this.server.in(game.gameId).emit('joined', `Welcome to room ${game.gameId}`);
    }

    @SubscribeMessage("start game")
    startGame(@MessageBody() playerId: string) {

    }

    @SubscribeMessage('finish game')
    remove(@MessageBody() finishGameDto: FinishGameDto) {
        return this.gameService.finish(
            finishGameDto.playerOne,
            finishGameDto.playerTwo,
            finishGameDto.won,
        );
    }

    @SubscribeMessage('start game')
    start(@ConnectedSocket() client: Socket) {
        console.log(client.rooms);
        return 'HOLA';
    }
}
