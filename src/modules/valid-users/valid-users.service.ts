import { Injectable } from '@nestjs/common';
import { CreateValidUserDto } from './dto/create-valid-user.dto';
import { UpdateValidUserDto } from './dto/update-valid-user.dto';

@Injectable()
export class ValidUsersService {
  create(createValidUserDto: CreateValidUserDto) {
    return 'This action adds a new validUser';
  }

  findAll() {
    return `This action returns all validUsers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} validUser`;
  }

  update(id: number, updateValidUserDto: UpdateValidUserDto) {
    return `This action updates a #${id} validUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} validUser`;
  }
}
