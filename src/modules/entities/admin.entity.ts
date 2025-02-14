import { Entity, PrimaryKey } from '@mikro-orm/core';
import { UserRole } from '../../enums/user-role.enum';
import { User } from './user.entity';

@Entity({ schema: '*' })
export class Admin extends User {
  constructor() {
    super();
    this.role = UserRole.ADMIN;
  }

  @PrimaryKey()
  _id!: number;
}
