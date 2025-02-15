import { Test, TestingModule } from '@nestjs/testing';
import { UnitTenantsController } from './unit-tenants.controller';
import { UnitTenantsService } from './unit-tenants.service';

describe('UnitTenantsController', () => {
  let controller: UnitTenantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitTenantsController],
      providers: [UnitTenantsService],
    }).compile();

    controller = module.get<UnitTenantsController>(UnitTenantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
