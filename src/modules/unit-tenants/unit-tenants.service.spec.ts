import { Test, TestingModule } from '@nestjs/testing';
import { UnitTenantsService } from './unit-tenants.service';

describe('UnitTenantsService', () => {
  let service: UnitTenantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnitTenantsService],
    }).compile();

    service = module.get<UnitTenantsService>(UnitTenantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
