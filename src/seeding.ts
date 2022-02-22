import { NestFactory } from '@nestjs/core';

import { DatabaseModule } from './modules/database.module';
import { DatabaseService } from './services/database.service';
import {
  PUBLISHER_FIELDS,
  GAME_FIELDS,
  PUBLISHER_DATA,
  GAME_DATA,
} from './utils/constants';

async function bootstrap() {
  const client = await NestFactory.createApplicationContext(DatabaseModule);
  const seeder = client.get(DatabaseService);

  const TABLES = [
    {
      name: 'publisher',
      fields: PUBLISHER_FIELDS,
    },
    {
      name: 'game',
      fields: GAME_FIELDS,
    },
  ];

  await seeder.createTables(TABLES);

  await seeder.seed({
    tableName: 'publisher',
    lines: PUBLISHER_DATA,
  });
  await seeder.seed({
    tableName: 'game',
    lines: GAME_DATA,
  });
}

bootstrap();
