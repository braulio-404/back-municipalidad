import { Test, TestingModule } from '@nestjs/testing';
import { ComunaService } from './comuna.service';

describe('ComunaService', () => {
  let service: ComunaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComunaService],
    }).compile();

    service = module.get<ComunaService>(ComunaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
