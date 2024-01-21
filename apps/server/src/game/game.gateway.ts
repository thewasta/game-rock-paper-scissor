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
import {Logger, UseGuards} from '@nestjs/common';
import {GameGuard} from "./game.guard";
import {QuitGameDto} from "./dto/quit-game.dto";
import {RoomService} from "./room.service";
import {RoundGameDto} from "./dto/round-game.dto";
import {GameDto} from "./dto/game.dto";

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private server: Server;

    private logger = new Logger();

    constructor(private readonly gameService: GameService, private readonly roomService: RoomService) {
        this.logger.debug(JSON.stringify(this.server));
    }

    async handleConnection(client: Socket): Promise<void> {
        this.logger.debug(`New client connected ${client.id}`);
        try {
            const cookies = client.handshake.headers.cookie;
            const splitCookies = cookies.split("; ")
            const userSessionCookie = splitCookies.find(cookie => cookie.startsWith('rockpaperscissor')).split('=')[1];
            await this.gameService.playerConnection(userSessionCookie, client.id);
        }catch (e) {
           this.logger.error('Unable to get COOKIE');
        }
        setTimeout(() => {
            client.broadcast.emit("user count", this.server.engine.clientsCount);
        }, 100);
    }

    async handleDisconnect(client: Socket): Promise<void> {
        this.logger.debug(`Client disconnect: ${client.id}`);
        try {
            const cookies = client.handshake.headers.cookie;
            const splitCookies = cookies.split("; ")
            const userSessionCookie = splitCookies.find(cookie => cookie.startsWith('rockpaperscissor')).split('=')[1];
            await this.gameService.playerDisconnection(userSessionCookie, client.id)
        }catch (e) {
            this.logger.error('Unable to get COOKIE');
        }
        setTimeout(() => {
            this.server.emit("user count disconnect", this.server.engine.clientsCount);
        }, 100);
    }

    @UseGuards(GameGuard)
    @SubscribeMessage('find game')
    async findOne(
        @MessageBody() findGameDto: FindGameDto,
        @ConnectedSocket() client: Socket,
    ) {
        try {
            const parser: FindGameDto = findGameDto;
            const game = await this.gameService.findOne(
                parser.playerId,
                parser.gameId,
            );
            client.join(game.gameId);
            this.server.in(game.gameId).emit('joined', {
                playerOne: game.playerOne,
                playerTwo: game.playerTwo,
                gameId: game.gameId
            });
            if (game.playerOne && game.playerTwo) {
                setTimeout(() => {
                    this.server.in(game.gameId).emit('start game');
                }, 100)
            }
        } catch (e) {
            this.logger.log('ERROR FINDING')
            this.logger.error(e.stack);
            this.logger.log('-----------------------')
        }
    }

    @SubscribeMessage('finish game')
    remove(@MessageBody() finishGameDto: FinishGameDto) {

    }

    @SubscribeMessage("quit game")
    async quit(@MessageBody() quitGame: QuitGameDto, @ConnectedSocket() client: Socket): Promise<string> {
        await this.gameService.quit(quitGame.player, quitGame.gameId);
        this.server.in(quitGame.gameId).emit('leave-room');
        this.server.socketsLeave(quitGame.gameId);
        return "quited game";
    }

    @SubscribeMessage('start game')
    start(@MessageBody() playerId: string, @ConnectedSocket() client: Socket) {
        console.log(client.rooms);
        return 'HOLA';
    }

    @SubscribeMessage('player action')
    async playerAction(@MessageBody() body: RoundGameDto, @ConnectedSocket() client: Socket): Promise<string> {
        try {
            const action = await this.roomService.action(body.player, body.gameId, body.action);
            const game = await this.gameService.findGame(body.gameId);
            if (action === "FINISHED") {
                if (game.won === "DRAW") {
                    this.server.to(game.gameId).emit("draw game");
                }
                const playerSocket = await this.gameService.findPlayerSocket(game.won);
                await this.gameService.finish(game.gameId, game.won);
                this.server.to(playerSocket).emit('you won');
            }

            if (action instanceof GameDto) {
                const gameResultWinner = this.roomService.determineGameResult(game);
                this.server.to(body.gameId).emit('finished game', gameResultWinner);
                return;
            }
            // DEVOLVER EVENTO QUE ESPERE LA ACCIÓN DEL SEGUNDO JUGADOR

            if (action === "NEXT") {
                this.server.to(body.gameId).emit('your turn');
            }
            // DEVOLVER EVENTO PARA HABILITAR OTRA VEZ LOS BOTONES
            // DEVOLVER EVENTO CON RESULTADO DE RONDA
            return "result";
        } catch (e) {
            this.logger.log('PLAYER ACTION ERROR')
            this.logger.error(e.stack)
            this.logger.log('--------------------------')
        }
    }
}
