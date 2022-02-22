import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import * as moment from 'moment';

import {
  GameRecord,
  Pagination,
  PublisherRecord,
  GamePublisherInfo,
} from 'src/utils/types';

import { DATABASE } from '../config';
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

  async addGame({
    title,
    price,
    publisher,
    tags,
    release_date,
  }: GameRecord): Promise<GameRecord> {
    try {
      const query = `
        INSERT INTO "game" (title, price, publisher, tags, release_date, discount)
        VALUES ('${title}', ${price}, ${publisher}, '${tags}', ${release_date}, ${false})
        RETURNING *
    `;

      const { rows } = await this.client.query(query);

      return rows[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  async getGameByTitle(title: string): Promise<GameRecord | void> {
    try {
      const query = `
        SELECT * FROM "game"
        WHERE game.title = '${title}'
      `;

      const { rows } = await this.client.query(query);

      return rows[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteGame(id: string): Promise<void> {
    try {
      const query = `
        DELETE FROM "game"
        WHERE game.id = '${id}'
      `;

      const { rows } = await this.client.query(query);

      return rows[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  async getGameById(id: number): Promise<GameRecord | void> {
    try {
      const query = `
        SELECT * FROM "game"
        WHERE game.id = ${id}
      `;

      const { rows } = await this.client.query(query);

      return rows[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  async getPublisherById(id: number): Promise<PublisherRecord | void> {
    try {
      const query = `
        SELECT * FROM "publisher"
        WHERE publisher.id = ${id}
      `;

      const { rows } = await this.client.query(query);

      return rows[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateGame({
    id,
    title,
    price,
    publisher,
    tags,
    release_date,
  }: GameRecord): Promise<GameRecord> {
    try {
      const query = `
        UPDATE "game"
        SET title = '${title}', price = ${price}, publisher = ${publisher}, tags = '${tags}', release_date = ${release_date}
        WHERE game.id = ${id}
        RETURNING *
      `;

      const { rows } = await this.client.query(query);

      return rows[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  async getGamePublisherInfo(id: number): Promise<GamePublisherInfo | void> {
    try {
      const query = `
        SELECT
          g.title,
          g.release_date,
          g.price,
          g.id AS "gameId",
          b.name AS "publisheName"
        FROM "game" g, "publisher" b
        WHERE g.id = ${id}
        AND g.publisher = b.id`;

      const { rows } = await this.client.query(query);
      return rows[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  async handleOldGames(): Promise<{
    deleted: GameRecord[] | [];
    discounted: GameRecord[] | [];
  }> {
    try {
      const currentDate = new Date().getTime();
      const twelveMonthsRestricted = moment(currentDate)
        .subtract(12, 'month')
        .format('x');

      const eighteenMonthRestricted = moment(currentDate)
        .subtract(18, 'month')
        .format('x');

      const deleteOldGamesQuery = `DELETE FROM "game" WHERE
        game.release_date < ${eighteenMonthRestricted}
        RETURNING *        ;
      `;

      const getGamesForDiscountQuery = `UPDATE "game" 
        SET price = price * 0.8, discount = true
        WHERE
          game.discount = false
        AND
          game.release_date < ${twelveMonthsRestricted}
          AND game.release_date > ${eighteenMonthRestricted}
          RETURNING *;
    `;

      const { rows: deletedGames } = await this.client.query(
        deleteOldGamesQuery,
      );

      const { rows: discountedGames } = await this.client.query(
        getGamesForDiscountQuery,
      );

      return {
        deleted: deletedGames,
        discounted: discountedGames,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
