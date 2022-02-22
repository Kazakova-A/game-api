import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { GamesController } from '../controllers/games.controller';
import { GamesService } from '../services/games.service';
import { PaginationMiddleware } from '../middlewares/pagintation';

@Module({
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginationMiddleware).forRoutes('/games');
  }
}
