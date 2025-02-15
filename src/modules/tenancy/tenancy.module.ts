import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';

import { TenantConnectionFactory } from './tenant-connection.factory';
import { TenancyMiddleware } from './tenancy.middleware';

@Module({
  providers: [TenantConnectionFactory],
  exports: [TenantConnectionFactory],
  controllers: [],
})
export class TenancyModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenancyMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
