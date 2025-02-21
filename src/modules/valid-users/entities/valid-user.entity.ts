import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class ValidUser {
  @PrimaryKey()
  _id!: number;

  @Property({ unique: true })
  email!: string;

  @Property()
  name!: string;

  @Property()
  role!: 'Manager' | 'UnitTenant';

  @Property({ default: false })
  isActive!: boolean;

  @Property({ nullable: true })
  inviteCode?: string;
}
