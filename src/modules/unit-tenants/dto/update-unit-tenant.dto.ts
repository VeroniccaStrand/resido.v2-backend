import { PartialType } from '@nestjs/mapped-types';
import { CreateUnitTenantDto } from './create-unit-tenant.dto';

export class UpdateUnitTenantDto extends PartialType(CreateUnitTenantDto) {}
