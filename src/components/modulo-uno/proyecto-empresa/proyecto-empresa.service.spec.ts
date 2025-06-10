import { Test, TestingModule } from '@nestjs/testing';
import { ProyectoEmpresaService } from './proyecto-empresa.service';

describe('ProyectoEmpresaService', () => {
  let service: ProyectoEmpresaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProyectoEmpresaService],
    }).compile();

    service = module.get<ProyectoEmpresaService>(ProyectoEmpresaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
