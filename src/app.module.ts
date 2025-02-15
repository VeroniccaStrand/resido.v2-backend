import { Module } from '@nestjs/common';
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

import configuration from './database/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MikroOrmModule.forRoot(config),
    UsersModule,
    TenantsModule,
    ManagersModule,
    UnitTenantsModule,
    AdminsModule,
    TenancyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
