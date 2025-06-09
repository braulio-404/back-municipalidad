import { Test, TestingModule } from '@nestjs/testing';
import { OfertaTrabajoController } from './oferta-trabajo.controller';
import { OfertaTrabajoService } from './oferta-trabajo.service';

describe('OfertaTrabajoController', () => {
  let controller: OfertaTrabajoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfertaTrabajoController],
      providers: [OfertaTrabajoService],
    }).compile();

    controller = module.get<OfertaTrabajoController>(OfertaTrabajoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
