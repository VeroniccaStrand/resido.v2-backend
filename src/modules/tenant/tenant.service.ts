import { Injectable } from '@nestjs/common';
import { MikroORM, EntityManager } from '@mikro-orm/core';
import { CreateTenantDto } from './dto/createTenantDto';
import { Tenant } from '../entities/tenant.entity';
import dbConfig from '../../mikro-orm-tenant.config';

@Injectable()
export class TenantService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}

  async createTenant(dto: CreateTenantDto) {
    const { company } = dto;
    const schemaName = `tenant_${company.toLowerCase().replace(/\s/g, '_')}`;

    const tenant = new Tenant();
    tenant.company = company;
    tenant.schemaName = schemaName;
    await this.em.persistAndFlush(tenant);

    await this.em
      .getConnection()
      .execute(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
    console.log(`✅ Schema "${schemaName}" created`);

    const schemaCheck = (await this.em
      .getConnection()
      .execute(
        `SELECT schema_name FROM information_schema.schemata WHERE schema_name = ?`,
        [schemaName],
      )) as unknown as { schema_name: string }[];
    if (!schemaCheck || schemaCheck.length === 0) {
      throw new Error(`❌ Failed to verify schema creation: ${schemaName}`);
    }

    const tenantOrm = await MikroORM.init({
      ...dbConfig,
      schema: schemaName,
    });

    console.log(`✅ ORM instance initialized for "${schemaName}"`);

    await tenantOrm.getSchemaGenerator().createSchema({ schema: schemaName });
    console.log(`✅ Schema "${schemaName}" created`);

    await tenantOrm.close();
  }
}
