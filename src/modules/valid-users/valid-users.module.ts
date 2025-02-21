import { Module } from '@nestjs/common';
import { ValidUsersService } from './valid-users.service';
import { ValidUsersController } from './valid-users.controller';

@Module({
  controllers: [ValidUsersController],
  providers: [ValidUsersService],
})
export class ValidUsersModule {}
