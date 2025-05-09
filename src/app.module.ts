import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import config from './mikro-orm-public.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { UsersModule } from './modules/users/users.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { ManagersModule } from './modules/managers/managers.module';
import { UnitTenantsModule } from './modules/unit-tenants/unit-tenants.module';
import { AdminsModule } from './modules/admins/admins.module';
import { TenancyModule } from './modules/tenancy/tenancy.module';

import configuration from './config/configuration';
import { LoggerModule } from './logger/logger.module';
import { RequestLoggerMiddleware } from './logger/request-logger.middleware';
import { ValidUsersModule } from './modules/valid-users/valid-users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    LoggerModule,
    MikroOrmModule.forRoot(config),
    UsersModule,
    TenantsModule,
    ManagersModule,
    UnitTenantsModule,
    AdminsModule,
    TenancyModule,
    ValidUsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
