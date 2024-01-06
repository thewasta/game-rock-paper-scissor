import { Controller, Get, Param } from '@nestjs/common';
import { PlayerService } from './player.service';
import { Player } from './entities/player.entity';

@Controller('player')
export class PlayerController {
    constructor(private readonly playerService: PlayerService) {
    }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Player> {
    return this.playerService.findOne(+id);
  }
}
