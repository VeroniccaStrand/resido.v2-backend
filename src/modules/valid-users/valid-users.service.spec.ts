import { Test, TestingModule } from '@nestjs/testing';
import { ValidUsersService } from './valid-users.service';

describe('ValidUsersService', () => {
  let service: ValidUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidUsersService],
    }).compile();

    service = module.get<ValidUsersService>(ValidUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
