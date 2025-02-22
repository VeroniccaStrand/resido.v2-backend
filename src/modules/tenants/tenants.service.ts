import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import dbConfig from '../../mikro-orm-tenant.config';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { Tenant } from './entities/tenant.entity';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoggerService } from '@nestjs/common';
import { AppError } from '../../errorHandling/AppError';

@Injectable()
export class TenantsService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async create(dto: CreateTenantDto) {
    const { company } = dto;
    const schemaName = `tenant_${company.toLowerCase().replace(/[^a-z0-9_]/g, '')}`;

    if (schemaName.length > 45) {
      throw new AppError(
        '❌ Schema-namnet är för långt! Max 45 tecken.',
        HttpStatus.BAD_REQUEST,
        'SCHEMA_NAME_TOO_LONG',
        'TenantsService',
        { schemaName },
      );
    }

    return this.orm.em.transactional(async (em) => {
      try {
        const tenant = new Tenant();
        tenant.company = company;
        tenant.schemaName = schemaName;
        await em.persistAndFlush(tenant);

        await this.createSchema(schemaName, em);

        await this.initializeTenantSchema(schemaName);

        this.logger.log(
          `✅ Tenant "${company}" och schema "${schemaName}" skapades framgångsrikt.`,
        );
        return tenant;
      } catch (error) {
        this.logger.error(` Fel vid skapande av tenant "${company}":`, error);
        throw new AppError(
          ` Kunde inte skapa tenant "${company}".`,
          HttpStatus.INTERNAL_SERVER_ERROR,
          'TENANT_CREATION_FAILED',
          'TenantsService',
          { schemaName, company },
        );
      }
    });
  }

  private async createSchema(schemaName: string, em: EntityManager) {
    try {
      await em
        .getConnection()
        .execute(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
      this.logger.log(`✅ Schema "${schemaName}" skapat.`);

      // 🔹 Typa resultatet korrekt
      const result: unknown = await em
        .getConnection()
        .execute<
          { schema_name: string }[]
        >(`SELECT schema_name FROM information_schema.schemata WHERE schema_name = ?`, [schemaName]);

      // 🔹 Kontrollera att `result` är en array och har rätt struktur
      if (!Array.isArray(result) || result.length === 0) {
        this.logger.error(
          `❌ Misslyckades med att verifiera schema "${schemaName}"`,
        );
        throw new AppError(
          `❌ Misslyckades med att verifiera schema: "${schemaName}"`,
          HttpStatus.INTERNAL_SERVER_ERROR,
          'SCHEMA_VERIFICATION_FAILED',
          'TenantsService',
          { schemaName },
        );
      }

      this.logger.log(`✅ Schema "${schemaName}" verifierat.`);
    } catch (error) {
      this.logger.error(
        `❌ Fel vid skapande av schema "${schemaName}":`,
        error,
      );
      throw new AppError(
        `Kunde inte skapa schema "${schemaName}".`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'SCHEMA_CREATION_FAILED',
        'TenantsService',
        { schemaName },
      );
    }
  }

  private async initializeTenantSchema(schemaName: string) {
    try {
      const tenantOrm = await MikroORM.init({
        ...dbConfig,
        schema: schemaName,
      });
      const connection = tenantOrm.em.getConnection();

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
      throw new AppError(
        `Kunde inte kopiera tabeller till schema "${schemaName}".`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'SCHEMA_TABLE_COPY_FAILED',
        'TenantsService',
        { schemaName },
      );
    }
  }
}
