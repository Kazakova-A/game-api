import { Module } from '@nestjs/common';

import { AppController } from '../controllers/app.controller';

import { AppService } from '../services/app.service';
import { GamesModule } from './games.module';

@Module({
  imports: [GamesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
