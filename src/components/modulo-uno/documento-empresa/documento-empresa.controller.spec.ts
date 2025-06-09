import { Test, TestingModule } from '@nestjs/testing';
import { DocumentoEmpresaController } from './documento-empresa.controller';
import { DocumentoEmpresaService } from './documento-empresa.service';

describe('DocumentoEmpresaController', () => {
  let controller: DocumentoEmpresaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentoEmpresaController],
      providers: [DocumentoEmpresaService],
    }).compile();

    controller = module.get<DocumentoEmpresaController>(DocumentoEmpresaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
