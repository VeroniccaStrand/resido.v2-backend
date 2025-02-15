import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UnitTenantsService } from './unit-tenants.service';
import { CreateUnitTenantDto } from './dto/create-unit-tenant.dto';
import { UpdateUnitTenantDto } from './dto/update-unit-tenant.dto';

@Controller('unit-tenants')
export class UnitTenantsController {
  constructor(private readonly unitTenantsService: UnitTenantsService) {}

  @Post()
  create(@Body() createUnitTenantDto: CreateUnitTenantDto) {
    return this.unitTenantsService.create(createUnitTenantDto);
  }

  @Get()
  findAll() {
    return this.unitTenantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unitTenantsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUnitTenantDto: UpdateUnitTenantDto) {
    return this.unitTenantsService.update(+id, updateUnitTenantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unitTenantsService.remove(+id);
  }
}
