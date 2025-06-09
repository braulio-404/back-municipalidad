import { Test, TestingModule } from '@nestjs/testing';
import { DocumentoPostulanteService } from './documento-postulante.service';

describe('DocumentoPostulanteService', () => {
  let service: DocumentoPostulanteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentoPostulanteService],
    }).compile();

    service = module.get<DocumentoPostulanteService>(DocumentoPostulanteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
