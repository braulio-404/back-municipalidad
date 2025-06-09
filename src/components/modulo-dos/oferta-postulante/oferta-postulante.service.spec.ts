import { Test, TestingModule } from '@nestjs/testing';
import { OfertaPostulanteService } from './oferta-postulante.service';

describe('OfertaPostulanteService', () => {
  let service: OfertaPostulanteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfertaPostulanteService],
    }).compile();

    service = module.get<OfertaPostulanteService>(OfertaPostulanteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
