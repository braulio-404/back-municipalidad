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
      
      // Determinar si es un archivo individual o múltiple
      const esArchivoMultiple = resultado.esMultiple;
      const buffer = resultado.buffer;
      
      if (esArchivoMultiple) {
        res.set({
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="documentos-formulario-${descargarDocumentosDto.ids[0]}.zip"`,
          'Content-Length': buffer.length,
        });
      } else {
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="documento-formulario.pdf"',
          'Content-Length': buffer.length,
        });
      }
      
      res.status(HttpStatus.OK).send(buffer);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error al generar el archivo de descarga',
        error: error.message
      });
    }
  }
} 