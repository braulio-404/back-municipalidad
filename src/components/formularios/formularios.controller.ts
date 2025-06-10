import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { FormulariosService } from './formularios.service';
import { CreateFormularioDto } from './dto/create-formulario.dto';
import { UpdateFormularioDto } from './dto/update-formulario.dto';
import { DescargarDocumentosDto } from './dto/descargar-documentos.dto';

@Controller('formularios')
export class FormulariosController {
  constructor(private readonly formulariosService: FormulariosService) {}

  @Post()
  create(@Body() createFormularioDto: CreateFormularioDto) {
    return this.formulariosService.create(createFormularioDto);
  }

  @Get()
  findAll() {
    return this.formulariosService.findAll();
  }

  @Get('con-conteo')
  findAllConConteo() {
    return this.formulariosService.findAllConConteoOptimizado();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formulariosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFormularioDto: UpdateFormularioDto) {
    return this.formulariosService.update(+id, updateFormularioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formulariosService.remove(+id);
  }

  @Post('descargar')
  async descargarDocumentos(
    @Body() descargarDocumentosDto: DescargarDocumentosDto,
    @Res() res: Response
  ) {
    try {
      const resultado = await this.formulariosService.descargarDocumentos(descargarDocumentosDto);
      
      // Generar nombre del archivo principal con fecha
      const fechaActual = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const nombreArchivo = `Postulaciones${fechaActual}.zip`;
      
      // Siempre será un archivo ZIP con la nueva estructura
      res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${nombreArchivo}"`,
        'Content-Length': resultado.buffer.length,
      });
      
      res.status(HttpStatus.OK).send(resultado.buffer);
    } catch (error) {
      console.error('Error en endpoint descargar:', error);
      
      // Manejar diferentes tipos de errores
      if (error.name === 'NotFoundException') {
        res.status(HttpStatus.NOT_FOUND).json({
          message: error.message,
          error: 'No se encontraron documentos'
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Error al generar el archivo de descarga',
          error: error.message
        });
      }
    }
  }
} 