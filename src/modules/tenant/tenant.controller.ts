import { Controller, Post, Body } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/createTenantDto';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  async createTenant(@Body() dto: CreateTenantDto) {
    const tenant = await this.tenantService.createTenant(dto);
    return {
      message: `Tenant ${dto.company} created successfully`,
      tenant,
    };
  }
}
