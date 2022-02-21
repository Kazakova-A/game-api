import { Controller, Get, Req, Res } from '@nestjs/common';

import { GamesService } from '../services/games.service';
import response from '../utils/response';
import { RESPONSE_STATUSES as rs, SERVER_MESSAGES as sm } from '../config';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  async findAll(@Req() req, @Res() res) {
    try {
      const { limit, offset, page } = req.pagination;
      const result = await this.gamesService.getAllGames(limit, offset, page);

      return response(req, res, rs[200], sm.ok, result);
    } catch (error) {
      return response(req, res, rs[500], sm.internalServerError);
    }
  }
}
