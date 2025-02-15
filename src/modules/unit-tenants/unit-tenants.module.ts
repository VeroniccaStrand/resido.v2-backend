import { Module } from '@nestjs/common';
import { UnitTenantsService } from './unit-tenants.service';
import { UnitTenantsController } from './unit-tenants.controller';

@Module({
  controllers: [UnitTenantsController],
  providers: [UnitTenantsService],
})
export class UnitTenantsModule {}
