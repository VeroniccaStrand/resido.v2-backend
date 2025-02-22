import { Entity } from '@mikro-orm/core';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../../enums/user-role.enum';

@Entity()
export class UnitTenant extends User {
  constructor() {
    super();
    this.roles = [UserRole.UNIT_TENANT];
  }
}
