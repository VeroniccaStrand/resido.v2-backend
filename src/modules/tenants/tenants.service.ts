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
    const schemaName = `tenant_${company.toLowerCase().replace(/[^a-z0-9_]/g, '')}`;

    if (schemaName.length > 50) {
      throw new Error('❌ Schema-namnet är för långt! Max 50 tecken.');
    }

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
    try {
      await em
        .getConnection()
        .execute(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
      this.logger.log(`✅ Schema "${schemaName}" skapat.`);

      // Kontrollera att schemat existerar efter skapande
      const schemaExists: { schema_name: string }[] = (await em
        .getConnection()
        .execute(
          `SELECT schema_name
           FROM information_schema.schemata
           WHERE schema_name = ?`,
          [schemaName],
        )) as { schema_name: string }[];

      if (!schemaExists || schemaExists.length === 0) {
        throw new Error(
          `❌ Misslyckades med att verifiera schema: "${schemaName}"`,
        );
      }
    } catch (error) {
      this.logger.error(
        `❌ Fel vid skapande av schema "${schemaName}":`,
        error,
      );
      throw new Error(`🚨 Kunde inte skapa schema "${schemaName}".`);
    }
  }

  private async initializeTenantSchema(schemaName: string) {
    try {
      const tenantOrm = await MikroORM.init({
        ...dbConfig,
        schema: schemaName,
      });

      const connection = tenantOrm.em.getConnection();

      // 🔥 Hämta alla tabeller från template_tenant
      const tables: { tablename: string }[] = await connection.execute(`
          SELECT tablename
          FROM pg_tables
          WHERE schemaname = 'template_tenant'
          AND tablename != 'mikro_orm_migrations'
      `);

      for (const table of tables) {
        const tableName = table.tablename;
        this.logger.log(
          `🔄 Kopierar tabell "${tableName}" till schema "${schemaName}"...`,
        );

        // 🔥 Kopiera tabellstruktur inklusive constraints
        await connection.execute(`
            CREATE TABLE "${schemaName}"."${tableName}"
            (
                LIKE "template_tenant"."${tableName}" INCLUDING ALL
            )
        `);
      }

      this.logger.log(
        `✅ Alla tabeller har kopierats till "${schemaName}" med constraints.`,
      );
      await tenantOrm.close();
    } catch (error) {
      this.logger.error(
        `❌ Fel vid kopiering av tabeller till schema "${schemaName}":`,
        error,
      );
      throw new Error(
        `🚨 Kunde inte kopiera tabeller till schema "${schemaName}".`,
      );
    }
  }
}
