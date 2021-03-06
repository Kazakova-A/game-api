import { Injectable } from '@nestjs/common';
import { Client } from 'pg';

import { DATABASE } from '../config';
import { Tables } from '../utils/types';

@Injectable()
export class DatabaseService {
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

  // check if table exists in database
  async checkTable(tableName: string) {
    try {
      const request = `SELECT table_name
    FROM information_schema.tables
    WHERE table_schema='public'`;

      const { rows } = await this.client.query(request);
      const tableList = rows.map((item) => item.table_name);
      return tableList.includes(tableName);
    } catch (error) {
      throw new Error(error);
    }
  }

  async createTableQueries(tables: Tables[]) {
    try {
      const arr = await tables.reduce(async (promisedAcc, item) => {
        const queryFields = item.fields
          .map(({ name, type, link, key }) => {
            const query =
              link && key
                ? `${name} ${type} REFERENCES ${link} (${key})`
                : `${name} ${type}`;
            return query;
          })
          .join(', ');
        const query = `CREATE TABLE ${item.name} (id SERIAL PRIMARY KEY, ${queryFields});`;
        const accum = await promisedAcc;
        const isTableExist = await this.checkTable(item.name);

        if (isTableExist) {
          return accum;
        }

        return [...accum, query];
      }, Promise.resolve([]));

      return arr;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createTables(tables: Tables[]) {
    try {
      const queries = await this.createTableQueries(tables);
      const promises = queries.map((query) => this.client.query(query));
      await Promise.all(promises);
    } catch (error) {
      throw new Error(error);
    }
  }

  async insertLine({
    tableName,
    data,
  }: {
    tableName: string;
    data: { [key: string]: string | number | boolean};
  }) {
    const exist = await this.checkTable(tableName);
    if (!exist) {
      return;
    }

    const keys = Object.keys(data)
      .map((item) => `"${item.toLowerCase()}"`)
      .join(', ');
    const values = Object.values(data)
      .map((item) => `'${item}'`)
      .join(', ');
    const query = `insert into public."${tableName.toLowerCase()}"
      (${keys})
      values (${values})
    `;

    try {
      await this.client.query(query);
    } catch (error) {
      throw new Error(error);
    }
  }

  async seed({
    tableName,
    lines,
  }: {
    tableName: string;
    lines: { [key: string]: string | number | boolean }[];
  }) {
    const exist = await this.checkTable(tableName);

    if (!exist) {
      return;
    }

    const promises = lines.map((line) =>
      this.insertLine({ tableName, data: line }),
    );

    await Promise.all(promises);
  }
}
