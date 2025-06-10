import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OfertaPostulanteService } from './oferta-postulante.service';
import { CreateOfertaPostulanteDto } from './dto/create-oferta-postulante.dto';
import { UpdateOfertaPostulanteDto } from './dto/update-oferta-postulante.dto';

@ApiTags('public')
@Controller('oferta-postulante')
export class OfertaPostulanteController {
  constructor(private readonly ofertaPostulanteService: OfertaPostulanteService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva postulación a oferta' })
  @ApiResponse({ status: 200, description: 'Postulación creada exitosamente' })
  create(@Body() createOfertaPostulanteDto: CreateOfertaPostulanteDto) {
    return this.ofertaPostulanteService.create(createOfertaPostulanteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las postulaciones' })
  @ApiResponse({ status: 200, description: 'Postulaciones obtenidas exitosamente' })
  findAll() {
    return this.ofertaPostulanteService.findAll();
  }

  @Get('oferta/:ofertaID')
  @ApiOperation({ summary: 'Obtener postulaciones de una oferta específica' })
  @ApiResponse({ status: 200, description: 'Postulaciones de la oferta obtenidas exitosamente' })
  findByOferta(@Param('ofertaID') ofertaID: string) {
    return this.ofertaPostulanteService.findByOferta(ofertaID);
  }

  @Get('postulante/:postulanteID')
  @ApiOperation({ summary: 'Obtener postulaciones de un postulante específico' })
  @ApiResponse({ status: 200, description: 'Postulaciones del postulante obtenidas exitosamente' })
  findByPostulante(@Param('postulanteID') postulanteID: string) {
    return this.ofertaPostulanteService.findByPostulante(postulanteID);
  }

  @Get(':ofertaID/:postulanteID')
  @ApiOperation({ summary: 'Obtener postulación específica por llave compuesta' })
  @ApiResponse({ status: 200, description: 'Postulación encontrada exitosamente' })
  @ApiResponse({ status: 404, description: 'Postulación no encontrada' })
  findOne(@Param('ofertaID') ofertaID: string, @Param('postulanteID') postulanteID: string) {
    return this.ofertaPostulanteService.findOne(ofertaID, postulanteID);
  }

  @Patch(':ofertaID/:postulanteID')
  @ApiOperation({ summary: 'Actualizar postulación' })
  @ApiResponse({ status: 200, description: 'Postulación actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Postulación no encontrada' })
  update(@Param('ofertaID') ofertaID: string, @Param('postulanteID') postulanteID: string, @Body() updateOfertaPostulanteDto: UpdateOfertaPostulanteDto) {
    return this.ofertaPostulanteService.update(ofertaID, postulanteID, updateOfertaPostulanteDto);
  }

  @Delete(':ofertaID/:postulanteID')
  @ApiOperation({ summary: 'Eliminar postulación' })
  @ApiResponse({ status: 200, description: 'Postulación eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Postulación no encontrada' })
  remove(@Param('ofertaID') ofertaID: string, @Param('postulanteID') postulanteID: string) {
    return this.ofertaPostulanteService.remove(ofertaID, postulanteID);
  }
}
