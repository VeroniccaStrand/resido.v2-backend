import { Injectable, Scope } from '@nestjs/common';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import dbConfig from '../../mikro-orm-tenant.config';
@Injectable({ scope: Scope.REQUEST })
export class TenantConnectionFactory {
  private tenantConnections = new Map<string, MikroORM>();

  async getTenantConnections(schema: string): Promise<EntityManager> {
    if (!this.tenantConnections.has(schema)) {
      console.log(`🔄 Skapar ny connection för schema: ${schema}`);

      const tenantOrm = await MikroORM.init({
        ...dbConfig,
        schema,
      });

      this.tenantConnections.set(schema, tenantOrm);
    }

    const tenantOrm = this.tenantConnections.get(schema);
    if (!tenantOrm) {
      throw new Error(`❌ Kunde inte hämta connection för schema: ${schema}`);
    }

    return tenantOrm.em.fork(); // Returnerar en isolerad EntityManager
  }

  async closeAllConnections() {
    for (const [schema, connection] of this.tenantConnections) {
      console.log(`🔌 Stänger connection för schema: ${schema}`);
      await connection.close();
    }
    this.tenantConnections.clear();
  }
}
