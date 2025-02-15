import { Injectable, Logger } from '@nestjs/common';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import dbConfig from '../../mikro-orm-tenant.config';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenantsService {
  private readonly logger = new Logger(TenantsService.name);

  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}

  async create(dto: CreateTenantDto) {
    const { company } = dto;
    const schemaName = `tenant_${company.toLowerCase().replace(/\s/g, '_')}`;

    return this.orm.em.transactional(async (em) => {
      // 1. Skapa tenant-entitet
      const tenant = new Tenant();
      tenant.company = company;
      tenant.schemaName = schemaName;
      await em.persistAndFlush(tenant);

      // 2. Skapa schema i databasen
      await this.createSchema(schemaName, em);

      // 3. Initiera ORM för den nya tenanten och generera tabeller
      await this.initializeTenantSchema(schemaName);

      this.logger.log(
        `✅ Tenant "${company}" och schema "${schemaName}" skapades framgångsrikt.`,
      );
      return tenant;
    });
  }

  private async createSchema(schemaName: string, em: EntityManager) {
    await em
      .getConnection()
      .execute(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
    this.logger.log(`✅ Schema "${schemaName}" skapat.`);

    // Kontrollera att schemat existerar efter skapande
    const schemaExists = (await em
      .getConnection()
      .execute(
        `SELECT schema_name FROM information_schema.schemata WHERE schema_name = ?`,
        [schemaName],
      )) as { schema_name: string }[];

    if (!schemaExists || schemaExists.length === 0) {
      throw new Error(
        `❌ Misslyckades med att verifiera schema: "${schemaName}"`,
      );
    }
  }

  private async initializeTenantSchema(schemaName: string) {
    const tenantOrm = await MikroORM.init({
      ...dbConfig,
      schema: schemaName,
    });

    await tenantOrm.getSchemaGenerator().createSchema({ schema: schemaName });
    this.logger.log(`✅ ORM-instans och schema "${schemaName}" initierat.`);

    await tenantOrm.close();
  }
}
