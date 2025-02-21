import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ValidUsersService } from './valid-users.service';
import { CreateValidUserDto } from './dto/create-valid-user.dto';
import { UpdateValidUserDto } from './dto/update-valid-user.dto';

@Controller('valid-users')
export class ValidUsersController {
  constructor(private readonly validUsersService: ValidUsersService) {}

  @Post()
  create(@Body() createValidUserDto: CreateValidUserDto) {
    return this.validUsersService.create(createValidUserDto);
  }

  @Get()
  findAll() {
    return this.validUsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.validUsersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateValidUserDto: UpdateValidUserDto) {
    return this.validUsersService.update(+id, updateValidUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.validUsersService.remove(+id);
  }
}
