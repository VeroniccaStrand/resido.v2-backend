import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createWinstonOptions } from './logger.config';

@Global()
@Module({
  imports: [
    ConfigModule,
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createWinstonOptions(configService),
    }),
  ],
  exports: [WinstonModule],
})
export class LoggerModule {}
