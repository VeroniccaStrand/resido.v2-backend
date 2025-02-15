import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({
  schema: 'public',
  tableName: 'tenant',
})
export class Tenant {
  @PrimaryKey()
  _id!: number;

  @Property()
  company!: string;

  @Property({ unique: true })
  schemaName!: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
