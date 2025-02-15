import { Entity, PrimaryKey } from '@mikro-orm/core';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../../enums/user-role.enum';

@Entity({ schema: '*' })
export class UnitTenant extends User {
  constructor() {
    super();
    this.role = UserRole.UNIT_TENANT;
  }

  @PrimaryKey()
  _id!: number;
}
