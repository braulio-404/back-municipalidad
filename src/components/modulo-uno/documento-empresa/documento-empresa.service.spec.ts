import { Test, TestingModule } from '@nestjs/testing';
import { DocumentoEmpresaService } from './documento-empresa.service';

describe('DocumentoEmpresaService', () => {
  let service: DocumentoEmpresaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentoEmpresaService],
    }).compile();

    service = module.get<DocumentoEmpresaService>(DocumentoEmpresaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
