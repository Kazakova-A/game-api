import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

import { GAME_DATA } from '../src/utils/constants';
import { GameRecord } from '../src/utils/types';
import { GamesService } from '../src/services/games.service';
import { GamesModule } from '../src/modules/games.module';

describe('RoomsController', () => {
  let app: INestApplication;
  let newGameRecord: GameRecord;
  let databaseService: GamesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GamesModule],
      providers: [GamesService],
    }).compile();

    databaseService = await module.resolve(GamesService);

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    // await databaseService.deleteRecord('booking', newGameRecord.id);
    await app.close();
  });

  it('/games (GET). Should return all existed games', async () => {
    const {
      body: { status, message, data },
    } = await request(app.getHttpServer()).get('/games');

    expect(status).toBe(200);
    expect(message).toEqual('OK');
    expect(data.list.length).toBe(3);
  });

  it('/games/:id (GET). Get game by id', async () => {
    const id = 1;

    const result = await request(app.getHttpServer()).get(`/games/${id}`);

    const {
      body: { status, message, data },
    } = result;

    expect(status).toBe(200);
    expect(message).toEqual('OK');
    expect(data.title).toBe(GAME_DATA[0].title);
  });

  it('/games/detailed/:id (GET). Return info with base info about the game and publisher', async () => {
    const id = 1;

    const result = await request(app.getHttpServer()).get(
      `/games/detailed/${id}`,
    );

    const expected = {
      title: 'GTA 5',
      release_date: 1448162798000,
      price: 40,
      gameId: 1,
      publisheName: 'Rockstar games',
    };

    const {
      body: { status, message, data },
    } = result;

    expect(status).toBe(200);
    expect(message).toEqual('OK');
    expect(data.publisheName).toBe(expected.publisheName);
    expect(data.title).toBe(GAME_DATA[0].title);
  });

  it('/games (POST). Should create new game record', async () => {
    const req = {
      title: 'Sims 4',
      price: 90,
      tags: '',
      publisher: 1,
      release_date: 1632297658,
    };

    const result = await request(app.getHttpServer()).post('/games').send(req);

    const {
      body: { status, message, data },
    } = result;

    newGameRecord = data;

    expect(status).toBe(201);
    expect(message).toEqual('OK');
    expect(data.title).toBe('Sims 4');
  });

  it('/games/:id (PUT). Should update game record', async () => {
    const req = { ...newGameRecord, title: 'Sims 4 (beta)' };
    const {
      body: { status, message, data },
    } = await request(app.getHttpServer())
      .put(`/games/${newGameRecord.id}`)
      .send(req);

    expect(status).toBe(200);
    expect(message).toEqual('OK');
    expect(data.title).toEqual('Sims 4 (beta)');
  });

  it('/games/:id (DELETE). Should delete game by id', async () => {
    const {
      body: { status, message },
    } = await request(app.getHttpServer()).delete(`/games/${newGameRecord.id}`);

    expect(status).toBe(200);
    expect(message).toEqual('OK');
  });
});
