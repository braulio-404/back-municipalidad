import { Controller, Get, Param } from '@nestjs/common';
import { ComunaService } from './comuna.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';

@Controller('comuna')
@ApiTags('Comuna')
@Public()
export class ComunaController {
  constructor(private readonly comunaService: ComunaService) {}

  

  @Get()
  @ApiOperation({ summary: 'Obtener todas las comunas' })
  findAll() {
    return this.comunaService.findAll();
  }

  @Get(':comunaId')
  @ApiOperation({ summary: 'Obtener una comuna por su ID' })
  findOne(@Param('comunaId') comunaId: number) {
    return this.comunaService.findOne(comunaId);
  }

  
}
