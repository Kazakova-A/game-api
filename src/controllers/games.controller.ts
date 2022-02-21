import { Controller, Get, Post, Req, Res } from '@nestjs/common';

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

  @Post()
  async addGame(@Req() req, @Res() res) {
    try {
      const { title, price, publisher, tags, releaseDate } = req.body;

      if (!(title && price && publisher && releaseDate)) {
        return response(req, res, rs[400], sm.missingData);
      }

      // check if publisher exists
      const publisherRecord = await this.gamesService.getPublisherById(
        publisher,
      );

      if (!publisherRecord) {
        return response(req, res, rs[400], sm.publisherDoesNotExists);
      }

      // check if this game already exists
      const gameRecord = await this.gamesService.getGameByTitle(title);

      if (gameRecord) {
        return response(req, res, rs[204], sm.alreadyExists);
      }

      const result = await this.gamesService.addGame({
        title,
        price,
        publisher,
        tags,
        releaseDate,
      });

      return response(req, res, rs[200], sm.ok, result);
    } catch (error) {
      return response(req, res, rs[500], sm.internalServerError);
    }
  }
}
