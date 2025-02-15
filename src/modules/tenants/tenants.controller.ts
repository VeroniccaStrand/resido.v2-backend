import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { CreateTenantDto } from './dto/create-tenant.dto';

import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  async createTenant(@Body() dto: CreateTenantDto) {
    try {
      const tenant = await this.tenantsService.create(dto);
      return {
        message: `Tenant "${dto.company}" created successfully`,
        tenant,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
