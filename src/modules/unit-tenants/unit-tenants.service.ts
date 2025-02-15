import { Injectable } from '@nestjs/common';
import { CreateUnitTenantDto } from './dto/create-unit-tenant.dto';
import { UpdateUnitTenantDto } from './dto/update-unit-tenant.dto';

@Injectable()
export class UnitTenantsService {
  create(createUnitTenantDto: CreateUnitTenantDto) {
    return 'This action adds a new unitTenant';
  }

  findAll() {
    return `This action returns all unitTenants`;
  }

  findOne(id: number) {
    return `This action returns a #${id} unitTenant`;
  }

  update(id: number, updateUnitTenantDto: UpdateUnitTenantDto) {
    return `This action updates a #${id} unitTenant`;
  }

  remove(id: number) {
    return `This action removes a #${id} unitTenant`;
  }
}
