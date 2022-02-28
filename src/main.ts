import { NestFactory } from '@nestjs/core';

import { AppModule } from './modules/app.module';
import { PORT } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`))
}

bootstrap();
