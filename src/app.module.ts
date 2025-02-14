import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import config from './mikro-orm-public.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TenantController } from './modules/tenant/tenant.controller';
import { TenantService } from './modules/tenant/tenant.service';

import configuration from './database/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MikroOrmModule.forRoot(config),
  ],
  controllers: [AppController, TenantController],
  providers: [AppService, TenantService],
})
export class AppModule {}
