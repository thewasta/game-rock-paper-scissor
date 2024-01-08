import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    ConnectedSocket,
    OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';
import {GameService} from './game.service';
import {FindGameDto} from './dto/find-game.dto';
import {FinishGameDto} from './dto/finish-game.dto';
import {Server, Socket} from 'socket.io';
import {UseGuards} from '@nestjs/common';
import {GameGuard} from "./game.guard";

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private server: Server;

    constructor(private readonly gameService: GameService) {
    }

    handleConnection(client: any, ...args): any {
        console.log(`New client connected ${client.id}`)
        client.broadcast.emit("user count", this.server.engine.clientsCount)
    }

    handleDisconnect(client: any): any {
        console.log(`Client disconnected ${client.id}`);
        setTimeout(() => {
            this.server.emit("user count disconnect", this.server.engine.clientsCount);
        }, 100);
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
