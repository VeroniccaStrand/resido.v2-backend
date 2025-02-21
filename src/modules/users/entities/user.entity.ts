import {
  Entity,
  Enum,
  Property,
  EntityRepositoryType,
  EntityRepository,
} from '@mikro-orm/core';
import { UserRole } from '../../../enums/user-role.enum';

@Entity({
  abstract: true,
  repository: () => UserRepository,
})
export abstract class User {
  [EntityRepositoryType]?: UserRepository;
  @Property()
  name!: string;

  @Property()
  email!: string;

  @Property()
  hash!: string;

  @Enum(() => UserRole)
  role!: UserRole;
}

export class UserRepository extends EntityRepository<User> {}
