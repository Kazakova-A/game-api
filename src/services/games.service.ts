import { Injectable } from '@nestjs/common';
import { Client } from 'pg';

import { DATABASE } from '../config';
import { GameRecord, Pagination } from 'src/utils/types';
import formatPagination from '../utils/format-pagination';

@Injectable()
export class GamesService {
  client: any;
  constructor() {
    this.client = new Client({
      user: DATABASE.username,
      host: DATABASE.host,
      database: DATABASE.database,
      password: DATABASE.password,
      port: Number(DATABASE.port),
    });

    this.client.connect();
  }
  async getAllGames(
    limit,
    offset,
    page,
  ): Promise<{ list: GameRecord[]; pagination: Pagination }> {
    try {
      const query = `
        SELECT *
        FROM "game"
        LIMIT ${limit}
        OFFSET ${offset};
      `;
      const { rows: list } = await this.client.query(query);

      const { rows } = await this.client.query(`SELECT count(*) FROM game;`);
      const total = rows[0].count;

      return { list, pagination: formatPagination(limit, page, total) };
    } catch (error) {
      throw new Error(error);
    }
  }
}
