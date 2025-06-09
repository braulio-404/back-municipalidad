import { Test, TestingModule } from '@nestjs/testing';
import { OfertaPostulanteController } from './oferta-postulante.controller';
import { OfertaPostulanteService } from './oferta-postulante.service';

describe('OfertaPostulanteController', () => {
  let controller: OfertaPostulanteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfertaPostulanteController],
      providers: [OfertaPostulanteService],
    }).compile();

    controller = module.get<OfertaPostulanteController>(OfertaPostulanteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
