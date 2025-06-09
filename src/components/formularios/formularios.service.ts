import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateFormularioDto } from './dto/create-formulario.dto';
import { UpdateFormularioDto } from './dto/update-formulario.dto';
import { DescargarDocumentosDto } from './dto/descargar-documentos.dto';
import { Formulario } from './entities/formulario.entity';
import { Requisito } from '../requisitos/entities/requisito.entity';
import { Postulante } from '../modulo-dos/postulante/entities/postulante.entity';
import { DocumentoPostulante } from '../modulo-dos/documento-postulante/entities/documento-postulante.entity';
import * as archiver from 'archiver';
import { Readable } from 'stream';

@Injectable()
export class FormulariosService {
  constructor(
    @InjectRepository(Formulario)
    private formularioRepository: Repository<Formulario>,
    @InjectRepository(Requisito)
    private requisitoRepository: Repository<Requisito>,
    @InjectRepository(Postulante)
    private postulanteRepository: Repository<Postulante>,
    @InjectRepository(DocumentoPostulante)
    private documentoPostulanteRepository: Repository<DocumentoPostulante>,
  ) {}

  async create(createFormularioDto: CreateFormularioDto): Promise<Formulario> {
    const formulario = this.formularioRepository.create({
      cargo: createFormularioDto.cargo,
      descripcion: createFormularioDto.descripcion || null,
      requisitos: createFormularioDto.requisitos || null,
      fechaInicio: new Date(createFormularioDto.fechaInicio),
      fechaTermino: new Date(createFormularioDto.fechaTermino),
      estado: createFormularioDto.estado || 'Activo',
    });

    // Si hay requisitos seleccionados, buscarlos y asignarlos
    if (createFormularioDto.requisitosSeleccionados && createFormularioDto.requisitosSeleccionados.length > 0) {
      const requisitos = await this.requisitoRepository.find({
        where: { id: In(createFormularioDto.requisitosSeleccionados) }
      });
      formulario.requisitosSeleccionados = requisitos;
    }

    return await this.formularioRepository.save(formulario);
  }

  async findAll() {
    const formularios = await this.formularioRepository.find({
      relations: ['requisitosSeleccionados'],
      order: { fechaCreacion: 'DESC' }
    });

    // Obtener el conteo de postulantes para cada formulario
    const formulariosConConteo = await Promise.all(
      formularios.map(async (formulario) => {
        const cantidadPostulantes = await this.postulanteRepository.count({
          where: { formulario_id: formulario.id }
        });

        return {
          ...formulario,
          cantidadPostulantes
        };
      })
    );

    return formulariosConConteo;
  }

  // Método alternativo más eficiente usando query builder
  async findAllConConteoOptimizado() {
    const formularios = await this.formularioRepository
      .createQueryBuilder('formulario')
      .leftJoinAndSelect('formulario.requisitosSeleccionados', 'requisitos')
      .leftJoin('formulario.postulantes', 'postulantes')
      .addSelect('COUNT(postulantes.postulanteID)', 'cantidadPostulantes')
      .groupBy('formulario.id')
      .addGroupBy('requisitos.id')
      .orderBy('formulario.fechaCreacion', 'DESC')
      .getRawAndEntities();

    // Procesar los resultados para agregar el conteo
    return formularios.entities.map((formulario, index) => ({
      ...formulario,
      cantidadPostulantes: parseInt(formularios.raw[index]?.cantidadPostulantes || '0')
    }));
  }

  async findOne(id: number): Promise<Formulario> {
    const formulario = await this.formularioRepository.findOne({
      where: { id },
      relations: ['requisitosSeleccionados']
    });
    
    if (!formulario) {
      throw new NotFoundException(`Formulario con ID ${id} no encontrado`);
    }
    
    return formulario;
  }

  async update(id: number, updateFormularioDto: UpdateFormularioDto): Promise<Formulario> {
    const formulario = await this.findOne(id);
    
    // Actualizar campos básicos
    if (updateFormularioDto.cargo !== undefined) formulario.cargo = updateFormularioDto.cargo;
    if (updateFormularioDto.descripcion !== undefined) formulario.descripcion = updateFormularioDto.descripcion;
    if (updateFormularioDto.requisitos !== undefined) formulario.requisitos = updateFormularioDto.requisitos;
    if (updateFormularioDto.fechaInicio !== undefined) formulario.fechaInicio = new Date(updateFormularioDto.fechaInicio);
    if (updateFormularioDto.fechaTermino !== undefined) formulario.fechaTermino = new Date(updateFormularioDto.fechaTermino);
    if (updateFormularioDto.estado !== undefined) formulario.estado = updateFormularioDto.estado;

    // Actualizar requisitos seleccionados si se proporcionan
    if (updateFormularioDto.requisitosSeleccionados !== undefined) {
      if (updateFormularioDto.requisitosSeleccionados.length > 0) {
        const requisitos = await this.requisitoRepository.find({
          where: { id: In(updateFormularioDto.requisitosSeleccionados) }
        });
        formulario.requisitosSeleccionados = requisitos;
      } else {
        formulario.requisitosSeleccionados = [];
      }
    }

    return await this.formularioRepository.save(formulario);
  }

  async remove(id: number): Promise<void> {
    const formulario = await this.findOne(id);
    await this.formularioRepository.remove(formulario);
  }

  async descargarDocumentos(descargarDocumentosDto: DescargarDocumentosDto): Promise<{ buffer: Buffer; esMultiple: boolean }> {
    try {
      const formularioId = descargarDocumentosDto.ids[0]; // Tomamos el primer ID del array
      console.log(`Descargando documentos para formulario ID: ${formularioId}`);
      
      // 1. Buscar todos los postulantes que tengan ese formulario_id
      const postulantes = await this.postulanteRepository.find({
        where: { formulario_id: formularioId },
        relations: ['documentos', 'formulario']
      });

      console.log(`Se encontraron ${postulantes.length} postulantes para el formulario ${formularioId}`);

      if (postulantes.length === 0) {
        throw new NotFoundException(`No se encontraron postulantes para el formulario con ID ${formularioId}`);
      }

      // 2. Recopilar todos los documentos de todos los postulantes
      const todosLosDocumentos: DocumentoPostulante[] = [];
      postulantes.forEach(postulante => {
        console.log(`Postulante ${postulante.nombres} ${postulante.apellidoPaterno} tiene ${postulante.documentos.length} documentos`);
        todosLosDocumentos.push(...postulante.documentos);
      });

      console.log(`Total de documentos encontrados: ${todosLosDocumentos.length}`);

      if (todosLosDocumentos.length === 0) {
        throw new NotFoundException(`No se encontraron documentos para los postulantes del formulario ${formularioId}`);
      }

      // 3. Si hay un solo documento, retornarlo como archivo individual
      if (todosLosDocumentos.length === 1) {
        const documento = todosLosDocumentos[0];
        console.log(`Descargando documento individual: ${documento.nombreArchivo}`);
        
        if (!documento.contenido) {
          throw new NotFoundException('El documento no tiene contenido disponible');
        }
        
        const buffer = Buffer.from(documento.contenido, 'base64');
        return { buffer, esMultiple: false };
      }

      // 4. Si hay múltiples documentos, crear un archivo ZIP
      console.log('Creando archivo ZIP con múltiples documentos');
      const buffer = await this.crearArchivoRAR(todosLosDocumentos, formularioId);
      return { buffer, esMultiple: true };

    } catch (error) {
      console.error('Error en descargarDocumentos:', error);
      throw error;
    }
  }

  private async crearArchivoRAR(documentos: DocumentoPostulante[], formularioId: number): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const archive = archiver('zip', { zlib: { level: 9 } });
      const chunks: Buffer[] = [];

      archive.on('data', (chunk) => chunks.push(chunk));
      archive.on('end', () => {
        console.log(`Archivo ZIP creado exitosamente con ${documentos.length} documentos`);
        resolve(Buffer.concat(chunks));
      });
      archive.on('error', (err) => {
        console.error('Error al crear archivo ZIP:', err);
        reject(err);
      });

      let documentosAgregados = 0;

      // Agregar cada documento al archivo
      documentos.forEach((documento, index) => {
        if (documento.contenido) {
          try {
            const buffer = Buffer.from(documento.contenido, 'base64');
            
            // Generar nombre único para evitar conflictos
            let nombreArchivo;
            if (documento.nombreArchivo) {
              // Si tiene nombre original, mantenerlo pero agregar prefijo por si hay duplicados
              nombreArchivo = `${index + 1}_${documento.nombreArchivo}`;
            } else {
              // Si no tiene nombre, generar uno
              nombreArchivo = `documento_${index + 1}.${documento.tipoArchivo || 'bin'}`;
            }

            console.log(`Agregando al ZIP: ${nombreArchivo} (${buffer.length} bytes)`);
            archive.append(buffer, { name: nombreArchivo });
            documentosAgregados++;
          } catch (error) {
            console.error(`Error al procesar documento ${documento.documentoPostulanteID}:`, error);
            // Continuar con los demás documentos
          }
        } else {
          console.warn(`El documento ${documento.documentoPostulanteID} no tiene contenido`);
        }
      });

      if (documentosAgregados === 0) {
        reject(new Error('No se pudo agregar ningún documento al archivo ZIP'));
        return;
      }

      console.log(`Se agregaron ${documentosAgregados} de ${documentos.length} documentos al ZIP`);
      archive.finalize();
    });
  }
} 