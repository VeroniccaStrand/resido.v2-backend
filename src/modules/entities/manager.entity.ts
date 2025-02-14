import { Entity, PrimaryKey } from '@mikro-orm/core';
import { UserRole } from '../../enums/user-role.enum';
import { User } from './user.entity';

@Entity({ schema: '*' })
export class Manager extends User {
  constructor() {
    super();
    this.role = UserRole.MANAGER;
  }

  @PrimaryKey()
  _id!: number;
}
