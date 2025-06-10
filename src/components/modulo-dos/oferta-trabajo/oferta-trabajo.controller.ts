import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OfertaTrabajoService } from './oferta-trabajo.service';
import { CreateOfertaTrabajoDto } from './dto/create-oferta-trabajo.dto';
import { UpdateOfertaTrabajoDto } from './dto/update-oferta-trabajo.dto';

@ApiTags('public')
@Controller('oferta-trabajo')
export class OfertaTrabajoController {
  constructor(private readonly ofertaTrabajoService: OfertaTrabajoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva oferta de trabajo' })
  @ApiResponse({ status: 200, description: 'Oferta de trabajo creada exitosamente' })
  create(@Body() createOfertaTrabajoDto: CreateOfertaTrabajoDto) {
    return this.ofertaTrabajoService.create(createOfertaTrabajoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las ofertas de trabajo' })
  @ApiResponse({ status: 200, description: 'Ofertas de trabajo obtenidas exitosamente' })
  findAll() {
    return this.ofertaTrabajoService.findAll();
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Obtener ofertas de trabajo por estado' })
  @ApiResponse({ status: 200, description: 'Ofertas de trabajo por estado obtenidas exitosamente' })
  findByEstado(@Param('estado') estado: string) {
    return this.ofertaTrabajoService.findByEstado(estado);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener oferta de trabajo por ID' })
  @ApiResponse({ status: 200, description: 'Oferta de trabajo encontrada exitosamente' })
  @ApiResponse({ status: 404, description: 'Oferta de trabajo no encontrada' })
  findOne(@Param('id') id: string) {
    return this.ofertaTrabajoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar oferta de trabajo' })
  @ApiResponse({ status: 200, description: 'Oferta de trabajo actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Oferta de trabajo no encontrada' })
  update(@Param('id') id: string, @Body() updateOfertaTrabajoDto: UpdateOfertaTrabajoDto) {
    return this.ofertaTrabajoService.update(id, updateOfertaTrabajoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar oferta de trabajo' })
  @ApiResponse({ status: 200, description: 'Oferta de trabajo eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Oferta de trabajo no encontrada' })
  remove(@Param('id') id: string) {
    return this.ofertaTrabajoService.remove(id);
  }
}
