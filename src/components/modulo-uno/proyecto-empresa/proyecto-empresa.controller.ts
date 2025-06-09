import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProyectoEmpresaService } from './proyecto-empresa.service';
import { CreateProyectoEmpresaDto } from './dto/create-proyecto-empresa.dto';
import { UpdateProyectoEmpresaDto } from './dto/update-proyecto-empresa.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Proyecto-Empresa (Tabla Intermedia)')
@Controller('proyecto-empresa')
export class ProyectoEmpresaController {
  constructor(private readonly proyectoEmpresaService: ProyectoEmpresaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear postulación de empresa a proyecto' })
  @ApiResponse({ status: 200, description: 'Postulación creada exitosamente' })
  @ApiResponse({ status: 400, description: 'La empresa ya está postulada a este proyecto' })
  create(@Body() createProyectoEmpresaDto: CreateProyectoEmpresaDto) {
    return this.proyectoEmpresaService.create(createProyectoEmpresaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las relaciones proyecto-empresa' })
  @ApiResponse({ status: 200, description: 'Relaciones obtenidas correctamente' })
  findAll() {
    return this.proyectoEmpresaService.findAll();
  }

  @Get('proyecto/:proyectoID')
  @ApiOperation({ summary: 'Obtener empresas postuladas a un proyecto' })
  @ApiResponse({ status: 200, description: 'Empresas del proyecto obtenidas correctamente' })
  findByProyecto(@Param('proyectoID') proyectoID: string) {
    return this.proyectoEmpresaService.findByProyecto(proyectoID);
  }

  @Get('empresa/:empresaID')
  @ApiOperation({ summary: 'Obtener proyectos de una empresa' })
  @ApiResponse({ status: 200, description: 'Proyectos de la empresa obtenidos correctamente' })
  findByEmpresa(@Param('empresaID') empresaID: string) {
    return this.proyectoEmpresaService.findByEmpresa(empresaID);
  }

  @Get(':proyectoID/:empresaID')
  @ApiOperation({ summary: 'Obtener relación específica proyecto-empresa' })
  @ApiResponse({ status: 200, description: 'Relación obtenida correctamente' })
  @ApiResponse({ status: 404, description: 'Relación no encontrada' })
  findOne(@Param('proyectoID') proyectoID: string, @Param('empresaID') empresaID: string) {
    return this.proyectoEmpresaService.findOne(proyectoID, empresaID);
  }

  @Patch(':proyectoID/:empresaID')
  @ApiOperation({ summary: 'Actualizar relación proyecto-empresa (estado, observaciones)' })
  @ApiResponse({ status: 200, description: 'Relación actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Relación no encontrada' })
  update(
    @Param('proyectoID') proyectoID: string, 
    @Param('empresaID') empresaID: string, 
    @Body() updateProyectoEmpresaDto: UpdateProyectoEmpresaDto
  ) {
    return this.proyectoEmpresaService.update(proyectoID, empresaID, updateProyectoEmpresaDto);
  }

  @Delete(':proyectoID/:empresaID')
  @ApiOperation({ summary: 'Eliminar postulación de empresa a proyecto' })
  @ApiResponse({ status: 200, description: 'Relación eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Relación no encontrada' })
  remove(@Param('proyectoID') proyectoID: string, @Param('empresaID') empresaID: string) {
    return this.proyectoEmpresaService.remove(proyectoID, empresaID);
  }
}
