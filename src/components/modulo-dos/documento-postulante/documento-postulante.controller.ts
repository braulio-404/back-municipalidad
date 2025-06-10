import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DocumentoPostulanteService } from './documento-postulante.service';
import { CreateDocumentoPostulanteDto } from './dto/create-documento-postulante.dto';
import { UpdateDocumentoPostulanteDto } from './dto/update-documento-postulante.dto';

@ApiTags('public')
@Controller('documento-postulante')
export class DocumentoPostulanteController {
  constructor(private readonly documentoPostulanteService: DocumentoPostulanteService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo documento de postulante' })
  @ApiResponse({ status: 200, description: 'Documento de postulante creado exitosamente' })
  create(@Body() createDocumentoPostulanteDto: CreateDocumentoPostulanteDto) {
    return this.documentoPostulanteService.create(createDocumentoPostulanteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los documentos de postulantes' })
  @ApiResponse({ status: 200, description: 'Documentos de postulantes obtenidos exitosamente' })
  findAll() {
    return this.documentoPostulanteService.findAll();
  }

  @Get('postulante/:postulanteID')
  @ApiOperation({ summary: 'Obtener documentos de un postulante específico' })
  @ApiResponse({ status: 200, description: 'Documentos del postulante obtenidos exitosamente' })
  findByPostulante(@Param('postulanteID') postulanteID: string) {
    return this.documentoPostulanteService.findByPostulante(postulanteID);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener documento de postulante por ID' })
  @ApiResponse({ status: 200, description: 'Documento de postulante encontrado exitosamente' })
  @ApiResponse({ status: 404, description: 'Documento de postulante no encontrado' })
  findOne(@Param('id') id: string) {
    return this.documentoPostulanteService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar documento de postulante' })
  @ApiResponse({ status: 200, description: 'Documento de postulante actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Documento de postulante no encontrado' })
  update(@Param('id') id: string, @Body() updateDocumentoPostulanteDto: UpdateDocumentoPostulanteDto) {
    return this.documentoPostulanteService.update(id, updateDocumentoPostulanteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar documento de postulante' })
  @ApiResponse({ status: 200, description: 'Documento de postulante eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Documento de postulante no encontrado' })
  remove(@Param('id') id: string) {
    return this.documentoPostulanteService.remove(id);
  }
}
