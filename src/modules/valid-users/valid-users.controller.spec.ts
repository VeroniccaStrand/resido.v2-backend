import { Test, TestingModule } from '@nestjs/testing';
import { ValidUsersController } from './valid-users.controller';
import { ValidUsersService } from './valid-users.service';

describe('ValidUsersController', () => {
  let controller: ValidUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ValidUsersController],
      providers: [ValidUsersService],
    }).compile();

    controller = module.get<ValidUsersController>(ValidUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
