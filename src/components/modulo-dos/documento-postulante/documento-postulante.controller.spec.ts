import { Test, TestingModule } from '@nestjs/testing';
import { DocumentoPostulanteController } from './documento-postulante.controller';
import { DocumentoPostulanteService } from './documento-postulante.service';

describe('DocumentoPostulanteController', () => {
  let controller: DocumentoPostulanteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentoPostulanteController],
      providers: [DocumentoPostulanteService],
    }).compile();

    controller = module.get<DocumentoPostulanteController>(DocumentoPostulanteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
