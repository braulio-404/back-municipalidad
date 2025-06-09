import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocumentoEmpresaService } from './documento-empresa.service';
import { CreateDocumentoEmpresaDto } from './dto/create-documento-empresa.dto';
import { UpdateDocumentoEmpresaDto } from './dto/update-documento-empresa.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('documento-empresa')
@ApiTags('Documentos Empresa')
@Public()
export class DocumentoEmpresaController {
  constructor(private readonly documentoEmpresaService: DocumentoEmpresaService) {}

  @Post()
  @ApiOperation({ summary: 'Subir nuevo documento de empresa' })
  @ApiResponse({ status: 200, description: 'Documento de empresa creado exitosamente' })
  create(@Body() createDocumentoEmpresaDto: CreateDocumentoEmpresaDto) {
    return this.documentoEmpresaService.create(createDocumentoEmpresaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los documentos de empresa' })
  @ApiResponse({ status: 200, description: 'Documentos de empresa obtenidos correctamente' })
  findAll() {
    return this.documentoEmpresaService.findAll();
  }

  @Get('empresa/:empresaID')
  @ApiOperation({ summary: 'Obtener documentos por empresa' })
  @ApiResponse({ status: 200, description: 'Documentos de la empresa obtenidos correctamente' })
  findByEmpresa(@Param('empresaID') empresaID: string) {
    return this.documentoEmpresaService.findByEmpresa(empresaID);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener documento por ID' })
  @ApiResponse({ status: 200, description: 'Documento obtenido correctamente' })
  @ApiResponse({ status: 404, description: 'Documento no encontrado' })
  findOne(@Param('id') id: string) {
    return this.documentoEmpresaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar documento de empresa' })
  @ApiResponse({ status: 200, description: 'Documento actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Documento no encontrado' })
  update(@Param('id') id: string, @Body() updateDocumentoEmpresaDto: UpdateDocumentoEmpresaDto) {
    return this.documentoEmpresaService.update(id, updateDocumentoEmpresaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar documento de empresa' })
  @ApiResponse({ status: 200, description: 'Documento eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Documento no encontrado' })
  remove(@Param('id') id: string) {
    return this.documentoEmpresaService.remove(id);
  }
}
