import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';

import { Migrator } from '@mikro-orm/migrations';
import { Manager } from './modules/entities/manager.entity';
import { Admin } from './modules/entities/admin.entity';
import { User } from './modules/entities/user.entity';
import { UnitTenant } from './modules/entities/unit-tenant.entity';
import configuration from './database/configuration';

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
