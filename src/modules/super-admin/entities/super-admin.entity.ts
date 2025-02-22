import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { UserRole } from '../../../enums/user-role.enum';
import { Permission } from '../../../enums/user-permission.enum';

@Entity({ schema: 'public' })
export class SuperAdmin {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ unique: true })
  email!: string;

  @Property()
  hash!: string;

  @Property({ type: 'json', nullable: false })
  roles!: UserRole[];
  constructor() {
    this.roles = [UserRole.SUPER_ADMIN];
  }

  @Property({ type: 'json', nullable: true, default: null })
  permissions?: Permission[] | null;

  @Property({ default: true })
  isActive!: boolean;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
