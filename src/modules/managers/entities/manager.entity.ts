import { Entity, PrimaryKey } from '@mikro-orm/core';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../../enums/user-role.enum';

@Entity()
export class Manager extends User {
  constructor() {
    super();
    this.role = UserRole.MANAGER;
  }

  @PrimaryKey()
  _id!: number;
}
