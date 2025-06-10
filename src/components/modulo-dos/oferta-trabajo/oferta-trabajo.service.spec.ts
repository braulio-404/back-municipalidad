import { Test, TestingModule } from '@nestjs/testing';
import { OfertaTrabajoService } from './oferta-trabajo.service';

describe('OfertaTrabajoService', () => {
  let service: OfertaTrabajoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfertaTrabajoService],
    }).compile();

    service = module.get<OfertaTrabajoService>(OfertaTrabajoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
