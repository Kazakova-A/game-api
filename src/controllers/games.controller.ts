import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Req,
  Res,
  Param,
} from '@nestjs/common';

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

  @Get(':id')
  async getGame(@Req() req, @Res() res, @Param('id') id) {
    try {
      if (!id) {
        return response(req, res, rs[400], sm.missingData);
      }

      const gameRecord = await this.gamesService.getGameById(id);

      if (!gameRecord) {
        return response(req, res, rs[204], sm.notFound);
      }
      return response(req, res, rs[200], sm.ok, gameRecord);
    } catch (error) {
      return response(req, res, rs[500], sm.internalServerError);
    }
  }

  @Get('/detailed/:id')
  async getDetailedGameInfo(@Req() req, @Res() res, @Param('id') id) {
    try {
      if (!id) {
        return response(req, res, rs[400], sm.missingData);
      }

      const result = await this.gamesService.getGamePublisherInfo(id);

      if (!result) {
        return response(req, res, rs[204], sm.notFound);
      }

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

  @Delete(':id')
  async deleteGame(@Req() req, @Res() res, @Param('id') id) {
    try {
      if (!id) {
        return response(req, res, rs[400], sm.missingData);
      }

      await this.gamesService.deleteGame(id);
      return response(req, res, rs[200], sm.ok);
    } catch (error) {
      return response(req, res, rs[500], sm.internalServerError);
    }
  }

  @Put(':id')
  async updateGame(@Req() req, @Res() res, @Param('id') id) {
    try {
      const { title, price, publisher, tags, releaseDate } = req.body;

      if (!id) {
        return response(req, res, rs[400], sm.missingData);
      }

      // check if this game exists
      const gameRecord = await this.gamesService.getGameById(id);

      if (!gameRecord) {
        return response(req, res, rs[204], sm.notFound);
      }

      const updatedRecord = {
        id,
        title: title || gameRecord.title,
        price: price || gameRecord.price,
        publisher: publisher || gameRecord.publisher,
        tags: tags || gameRecord.tags,
        releaseDate: releaseDate || gameRecord.releaseDate,
      };

      const result = await this.gamesService.updateGame(updatedRecord);
      return response(req, res, rs[200], sm.ok, result);
    } catch (error) {
      return response(req, res, rs[500], sm.internalServerError);
    }
  }

  @Post('/filter')
  async handleOldGames(@Req() req, @Res() res) {
    try {
      const result = await this.gamesService.handleOldGames();
      return response(req, res, rs[200], sm.ok, result);
    } catch (error) {
      return response(req, res, rs[500], sm.internalServerError);
    }
  }
}
