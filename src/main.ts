import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService, ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger: LoggerService = app.get(WINSTON_MODULE_NEST_PROVIDER);

  app.useGlobalPipes(new ValidationPipe({}));

  await app.listen(process.env.PORT ?? 3000);
  logger.log('🚀 Server running on http://localhost:3000', 'Bootstrap');
}

bootstrap();
