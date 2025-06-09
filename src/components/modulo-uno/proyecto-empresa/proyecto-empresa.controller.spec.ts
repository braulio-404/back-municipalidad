import { Test, TestingModule } from '@nestjs/testing';
import { ProyectoEmpresaController } from './proyecto-empresa.controller';
import { ProyectoEmpresaService } from './proyecto-empresa.service';

describe('ProyectoEmpresaController', () => {
  let controller: ProyectoEmpresaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProyectoEmpresaController],
      providers: [ProyectoEmpresaService],
    }).compile();

    controller = module.get<ProyectoEmpresaController>(ProyectoEmpresaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
