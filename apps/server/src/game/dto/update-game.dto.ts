import { PartialType } from '@nestjs/mapped-types';
import { FindGameDto } from './find-game.dto';

export class UpdateGameDto extends PartialType(FindGameDto) {
  id: number;
}
