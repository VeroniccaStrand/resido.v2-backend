import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';

import { CreateTenantDto } from './dto/create-tenant.dto';

import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTenant(@Body() dto: CreateTenantDto) {
    console.log('heeeej');
    const tenant = await this.tenantsService.create(dto);
    console.log(tenant);
    return {
      message: `Tenant ${dto.company} created successfully.`,
      tenant,
    };
  }
}
