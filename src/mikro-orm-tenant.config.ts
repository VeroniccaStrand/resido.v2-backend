import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';

import { Migrator } from '@mikro-orm/migrations';

import configuration from './database/configuration';
import { User } from './modules/users/entities/user.entity';
import { Manager } from './modules/managers/entities/manager.entity';
import { Admin } from './modules/admins/entities/admin.entity';
import { UnitTenant } from './modules/unit-tenants/entities/unit-tenant.entity';

const dbConfig = configuration().database;
export default defineConfig({
  driver: PostgreSqlDriver,
  dbName: dbConfig.dbName,
  user: dbConfig.user,
  password: dbConfig.password,
  host: dbConfig.host,
  port: dbConfig.port,
  debug: true,
  schema: '*',
  allowGlobalContext: true,
  migrations: {
    path: `./migrations/template_tenant`,
    glob: '!(*.d).{js,ts}',
  },
  entities: [Manager, Admin, User, UnitTenant],
  extensions: [Migrator],
});
