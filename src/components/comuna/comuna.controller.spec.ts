import { Test, TestingModule } from '@nestjs/testing';
import { ComunaController } from './comuna.controller';
import { ComunaService } from './comuna.service';

describe('ComunaController', () => {
  let controller: ComunaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComunaController],
      providers: [ComunaService],
    }).compile();

    controller = module.get<ComunaController>(ComunaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
