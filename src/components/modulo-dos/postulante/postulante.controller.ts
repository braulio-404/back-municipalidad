import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import * as archiver from 'archiver';
import { Readable } from 'stream';
import { PostulanteService } from './postulante.service';
import { DocumentoPostulanteService } from '../documento-postulante/documento-postulante.service';
import { CreatePostulanteDto } from './dto/create-postulante.dto';
import { UpdatePostulanteDto } from './dto/update-postulante.dto';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('public')
@Public()
@Controller('postulante')
export class PostulanteController {
  constructor(
    private readonly postulanteService: PostulanteService,
    private readonly documentoPostulanteService: DocumentoPostulanteService
  ) {}

  /**
   * Crea un archivo ZIP con múltiples archivos
   */
  private async crearArchivoComprimido(files: Express.Multer.File[], postulanteID: string): Promise<Buffer> {
    console.log('=== INICIANDO COMPRESIÓN ===');
    console.log(`Archivos a comprimir: ${files.length}`);
    
    return new Promise((resolve, reject) => {
      const archive = archiver('zip', {
        zlib: { level: 9 } // Máximo nivel de compresión
      });

      const chunks: Buffer[] = [];
      let totalSize = 0;

      archive.on('data', (chunk) => {
        chunks.push(chunk);
        totalSize += chunk.length;
      });

      archive.on('end', () => {
        const buffer = Buffer.concat(chunks);
        console.log('=== COMPRESIÓN COMPLETADA ===');
        console.log(`Tamaño final del ZIP: ${buffer.length} bytes`);
        console.log(`Total de chunks procesados: ${chunks.length}`);
        resolve(buffer);
      });

      archive.on('error', (error) => {
        console.error('=== ERROR EN COMPRESIÓN ===');
        console.error('Error:', error);
        reject(error);
      });

      console.log('=== AGREGANDO ARCHIVOS AL ZIP ===');
      // Agregar cada archivo al zip
      files.forEach((file, index) => {
        console.log(`Agregando archivo ${index + 1}/${files.length}:`, {
          nombre: file.originalname,
          tipo: file.mimetype,
          tamaño: file.size,
          hasBuffer: !!file.buffer
        });
        
        const stream = Readable.from(file.buffer);
        archive.append(stream, { name: file.originalname });
      });

      console.log('Finalizando archivo...');
      archive.finalize();
    });
  }

  @Post('/crear-postulante')
  @UseInterceptors(AnyFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Crear nuevo postulante' })
  @ApiResponse({ status: 200, description: 'Postulante creado exitosamente' })
  @ApiResponse({ status: 409, description: 'RUT o email ya registrado' })
  async create(
    @Body() createPostulanteDto: CreatePostulanteDto,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    console.log('=== INICIO PROCESO CREAR POSTULANTE ===');
    console.log('Body completo:', createPostulanteDto);
    console.log('Archivos recibidos:', files);
    console.log('Cantidad de archivos:', files?.length || 0);
    
    if (files && files.length > 0) {
      console.log('=== DETALLE DE ARCHIVOS RECIBIDOS ===');
      files.forEach((file, index) => {
        console.log(`Archivo ${index + 1}:`, {
          fieldname: file.fieldname,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          hasBuffer: !!file.buffer
        });
      });
    }

    // Crear el postulante primero
    console.log('=== CREANDO POSTULANTE ===');
    const resultadoPostulante = await this.postulanteService.create(createPostulanteDto);
    console.log('Resultado creación postulante:', {
      status: resultadoPostulante.status,
      postulanteID: resultadoPostulante.data?.postulanteID
    });
    
    // Si se creó exitosamente y hay archivos, procesarlos
    if (resultadoPostulante.status === 200 && files && files.length > 0) {
      const postulanteID = resultadoPostulante.data.postulanteID;
      const documentosGuardados = [];

      console.log('=== PROCESANDO DOCUMENTOS ===');
      console.log(`PostulanteID: ${postulanteID}`);
      console.log(`Número de archivos a procesar: ${files.length}`);

      try {
        if (files.length === 1) {
          console.log('=== GUARDANDO ARCHIVO INDIVIDUAL ===');
          const file = files[0];
          
          const documentoDto = {
            postulanteID: postulanteID,
            nombreArchivo: file.originalname,
            tipoArchivo: file.mimetype,
            descripcion: `Documento subido durante el registro del postulante`,
            contenido: file.buffer ? file.buffer.toString('base64') : undefined
          };

          console.log('Documento individual a guardar:', {
            postulanteID,
            nombreArchivo: file.originalname,
            tipoArchivo: file.mimetype,
            size: file.size,
            descripcion: documentoDto.descripcion,
            tieneContenido: !!documentoDto.contenido,
            tamañoBase64: documentoDto.contenido?.length || 0
          });

          const documentoGuardado = await this.documentoPostulanteService.create(documentoDto);
          console.log('Documento individual guardado:', {
            id: documentoGuardado.data.documentoPostulanteID,
            nombre: documentoGuardado.data.nombreArchivo,
            tipo: documentoGuardado.data.tipoArchivo
          });
          
          documentosGuardados.push(documentoGuardado.data);
        } else {
          console.log('=== CREANDO ARCHIVO COMPRIMIDO ===');
          console.log(`Se detectaron ${files.length} archivos. Iniciando compresión...`);
          
          // Verificar que todos los archivos tienen buffer
          const archivosValidos = files.filter(f => f.buffer && f.buffer.length > 0);
          console.log(`Archivos válidos para comprimir: ${archivosValidos.length} de ${files.length}`);
          
          if (archivosValidos.length === 0) {
            throw new Error('No se encontraron archivos válidos para comprimir');
          }
          
          const archivoComprimido = await this.crearArchivoComprimido(archivosValidos, postulanteID);
          const fechaActual = new Date().toISOString().slice(0, 10).replace(/-/g, '');
          const nombreArchivoZip = `documentos_postulante_${postulanteID}_${fechaActual}.zip`;

          const documentoDto = {
            postulanteID: postulanteID,
            nombreArchivo: nombreArchivoZip,
            tipoArchivo: 'application/zip',
            descripción: `Archivo comprimido con ${archivosValidos.length} documentos subidos durante el registro del postulante`,
            contenido: archivoComprimido.toString('base64')
          };

          console.log('Archivo comprimido creado:', {
            postulanteID,
            nombreArchivo: nombreArchivoZip,
            tipoArchivo: 'application/zip',
            tamañoOriginal: archivoComprimido.length,
            tamañoBase64: documentoDto.contenido.length,
            archivosIncluidos: archivosValidos.map(f => f.originalname),
            descripcion: documentoDto.descripción
          });

          const documentoGuardado = await this.documentoPostulanteService.create(documentoDto);
          console.log('Archivo comprimido guardado en BD:', {
            id: documentoGuardado.data.documentoPostulanteID,
            nombre: documentoGuardado.data.nombreArchivo,
            tipo: documentoGuardado.data.tipoArchivo
          });
          
          documentosGuardados.push(documentoGuardado.data);
        }

        const tipoDocumento = files.length === 1 ? 'ARCHIVO INDIVIDUAL' : 'ARCHIVO COMPRIMIDO';
        const mensaje = files.length === 1 
          ? `Postulante creado exitosamente con 1 documento guardado` 
          : `Postulante creado exitosamente con archivo comprimido conteniendo ${files.length} documentos`;

        console.log('=== PROCESO COMPLETADO EXITOSAMENTE ===');
        console.log(`Tipo de documento guardado: ${tipoDocumento}`);
        console.log(`Mensaje: ${mensaje}`);
        console.log('Documentos guardados:', documentosGuardados.map(d => ({
          id: d.documentoPostulanteID,
          nombre: d.nombreArchivo,
          tipo: d.tipoArchivo
        })));
        
        return {
          ...resultadoPostulante,
          documentos: documentosGuardados,
          message: mensaje,
          tipoDocumento: tipoDocumento,
          archivosOriginales: files.length > 1 ? files.map(f => f.originalname) : undefined
        };
      } catch (error) {
        console.error('=== ERROR AL GUARDAR DOCUMENTOS ===');
        console.error('Error completo:', error);
        console.error('Stack trace:', error.stack);
        
        return {
          ...resultadoPostulante,
          message: 'Postulante creado exitosamente, pero hubo un error al guardar algunos documentos',
          warning: error.message,
          error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        };
      }
    }

    console.log('=== FINALIZANDO SIN ARCHIVOS ===');
    return resultadoPostulante;
  }

  @Get() 
  @ApiOperation({ summary: 'Obtener todos los postulantes' })
  @ApiResponse({ status: 200, description: 'Postulantes obtenidos exitosamente' })
  findAll() {
    return this.postulanteService.findAll();
  }

  @Get('rut/:rut')
  @ApiOperation({ summary: 'Buscar postulante por RUT' })
  @ApiResponse({ status: 200, description: 'Postulante encontrado exitosamente' })
  @ApiResponse({ status: 404, description: 'Postulante no encontrado' })
  findByRut(@Param('rut') rut: string) {
    return this.postulanteService.findByRut(rut);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Buscar postulante por email' })
  @ApiResponse({ status: 200, description: 'Postulante encontrado exitosamente' })
  @ApiResponse({ status: 404, description: 'Postulante no encontrado' })
  findByEmail(@Param('email') email: string) {
    return this.postulanteService.findByEmail(email);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener postulante por ID' })
  @ApiResponse({ status: 200, description: 'Postulante encontrado exitosamente' })
  @ApiResponse({ status: 404, description: 'Postulante no encontrado' })
  findOne(@Param('id') id: string) {
    return this.postulanteService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar postulante' })
  @ApiResponse({ status: 200, description: 'Postulante actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Postulante no encontrado' })
  @ApiResponse({ status: 409, description: 'RUT o email ya registrado' })
  update(@Param('id') id: string, @Body() updatePostulanteDto: UpdatePostulanteDto) {
    return this.postulanteService.update(id, updatePostulanteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar postulante' })
  @ApiResponse({ status: 200, description: 'Postulante eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Postulante no encontrado' })
  remove(@Param('id') id: string) {
    return this.postulanteService.remove(id);
  }
}
