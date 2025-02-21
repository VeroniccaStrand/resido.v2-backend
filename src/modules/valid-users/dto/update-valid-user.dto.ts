import { PartialType } from '@nestjs/mapped-types';
import { CreateValidUserDto } from './create-valid-user.dto';

export class UpdateValidUserDto extends PartialType(CreateValidUserDto) {}
