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
      const formularioIds = descargarDocumentosDto.ids;
      console.log(`Descargando documentos para formularios IDs: ${formularioIds.join(', ')}`);
      
      // Obtener fecha actual para el nombre del archivo principal
      const fechaActual = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const nombreArchivoPrincipal = `Postulaciones${fechaActual}`;
      
      // Crear el ZIP principal
      const buffer = await this.crearZipEstructurado(formularioIds, nombreArchivoPrincipal);
      return { buffer, esMultiple: true };

    } catch (error) {
      console.error('Error en descargarDocumentos:', error);
      throw error;
    }
  }

  private async crearZipEstructurado(formularioIds: number[], nombreArchivoPrincipal: string): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const archivePrincipal = archiver('zip', { zlib: { level: 9 } });
        const chunks: Buffer[] = [];

        archivePrincipal.on('data', (chunk) => chunks.push(chunk));
        archivePrincipal.on('end', () => {
          console.log(`ZIP principal creado exitosamente: ${nombreArchivoPrincipal}.zip`);
          resolve(Buffer.concat(chunks));
        });
        archivePrincipal.on('error', (err) => {
          console.error('Error al crear ZIP principal:', err);
          reject(err);
        });

        let totalDocumentosEncontrados = 0;
        let formulariosConPostulantes = 0;

        // Procesar cada formulario (postulación)
        for (const formularioId of formularioIds) {
          console.log(`\n=== Procesando formulario ID: ${formularioId} ===`);
          
          // 1. Buscar todos los postulantes de esta postulación
          const postulantes = await this.postulanteRepository.find({
            where: { formulario_id: formularioId },
            relations: ['documentos', 'formulario']
          });

          if (postulantes.length === 0) {
            console.warn(`No se encontraron postulantes para el formulario ${formularioId}`);
            continue;
          }

          console.log(`Se encontraron ${postulantes.length} postulantes para el formulario ${formularioId}`);

          // Contar documentos de este formulario
          const documentosFormulario = postulantes.reduce((total, postulante) => total + postulante.documentos.length, 0);
          totalDocumentosEncontrados += documentosFormulario;

          console.log(`Documentos encontrados en formulario ${formularioId}: ${documentosFormulario}`);

          if (documentosFormulario > 0) {
            formulariosConPostulantes++;
            
            // 2. Crear ZIP para esta postulación
            const nombreFormulario = postulantes[0].formulario?.cargo || `Postulacion_${formularioId}`;
            const zipPostulacion = await this.crearZipPorPostulacion(postulantes, nombreFormulario);
            
            // 3. Agregar el ZIP de la postulación al ZIP principal
            archivePrincipal.append(zipPostulacion, { name: `${nombreFormulario}.zip` });
            console.log(`ZIP de postulación agregado: ${nombreFormulario}.zip`);
          } else {
            console.warn(`No se encontraron documentos para los postulantes del formulario ${formularioId}`);
          }
        }

        console.log(`\n=== RESUMEN FINAL ===`);
        console.log(`Total de documentos encontrados: ${totalDocumentosEncontrados}`);
        console.log(`Formularios con documentos: ${formulariosConPostulantes}`);

        // Verificar si se encontraron documentos en total
        if (totalDocumentosEncontrados === 0) {
          reject(new NotFoundException('No se encontraron documentos para ningún postulante en las postulaciones solicitadas'));
          return;
        }

        archivePrincipal.finalize();
        
      } catch (error) {
        console.error('Error en crearZipEstructurado:', error);
        reject(error);
      }
    });
  }

  private async crearZipPorPostulacion(postulantes: Postulante[], nombrePostulacion: string): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const archive = archiver('zip', { zlib: { level: 9 } });
        const chunks: Buffer[] = [];

        archive.on('data', (chunk) => chunks.push(chunk));
        archive.on('end', () => {
          console.log(`ZIP de postulación "${nombrePostulacion}" creado exitosamente`);
          resolve(Buffer.concat(chunks));
        });
        archive.on('error', (err) => {
          console.error(`Error al crear ZIP de postulación "${nombrePostulacion}":`, err);
          reject(err);
        });

        // Agrupar postulantes por RUT para crear un ZIP por cada postulante
        const postulantesPorRut = new Map<string, Postulante[]>();
        postulantes.forEach(postulante => {
          const rut = postulante.rut;
          if (!postulantesPorRut.has(rut)) {
            postulantesPorRut.set(rut, []);
          }
          postulantesPorRut.get(rut)!.push(postulante);
        });

        console.log(`Postulantes únicos por RUT: ${postulantesPorRut.size}`);

        // Crear un ZIP por cada postulante (agrupado por RUT) usando for...of para manejar async correctamente
        for (const [rut, postulantesDelRut] of postulantesPorRut) {
          try {
            // Tomar el primer postulante para obtener el nombre
            const postulante = postulantesDelRut[0];
            const nombrePostulante = `${postulante.nombres}_${postulante.apellidoPaterno}_${rut}`;
            
            // Recopilar todos los documentos de este RUT
            const documentosDelPostulante: DocumentoPostulante[] = [];
            postulantesDelRut.forEach(p => {
              documentosDelPostulante.push(...p.documentos);
            });

            console.log(`Postulante ${nombrePostulante}: ${documentosDelPostulante.length} documentos`);

            if (documentosDelPostulante.length > 0) {
              const zipPostulante = await this.crearZipPorPostulante(documentosDelPostulante, nombrePostulante);
              archive.append(zipPostulante, { name: `${nombrePostulante}.zip` });
              console.log(`ZIP de postulante agregado: ${nombrePostulante}.zip`);
            }
            
          } catch (error) {
            console.error(`Error al procesar postulante con RUT ${rut}:`, error);
          }
        }

        // Finalizar el archivo después de procesar todos los postulantes
        archive.finalize();
        
      } catch (error) {
        console.error('Error en crearZipPorPostulacion:', error);
        reject(error);
      }
    });
  }

  private async crearZipPorPostulante(documentos: DocumentoPostulante[], nombrePostulante: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const archive = archiver('zip', { zlib: { level: 9 } });
      const chunks: Buffer[] = [];

      archive.on('data', (chunk) => chunks.push(chunk));
      archive.on('end', () => {
        console.log(`ZIP del postulante "${nombrePostulante}" creado con ${documentos.length} documentos`);
        resolve(Buffer.concat(chunks));
      });
      archive.on('error', (err) => {
        console.error(`Error al crear ZIP del postulante "${nombrePostulante}":`, err);
        reject(err);
      });

      let documentosAgregados = 0;

      // Agregar cada documento PDF al ZIP del postulante
      documentos.forEach((documento, index) => {
        if (documento.contenido) {
          try {
            const buffer = Buffer.from(documento.contenido, 'base64');
            
            // Generar nombre único para evitar conflictos
            let nombreArchivo;
            if (documento.nombreArchivo) {
              nombreArchivo = documento.nombreArchivo;
            } else {
              const extension = documento.tipoArchivo === 'application/pdf' ? 'pdf' : 'bin';
              nombreArchivo = `documento_${index + 1}.${extension}`;
            }

            console.log(`Agregando documento: ${nombreArchivo} (${buffer.length} bytes)`);
            archive.append(buffer, { name: nombreArchivo });
            documentosAgregados++;
          } catch (error) {
            console.error(`Error al procesar documento ${documento.documentoPostulanteID}:`, error);
          }
        } else {
          console.warn(`El documento ${documento.documentoPostulanteID} no tiene contenido`);
        }
      });

      if (documentosAgregados === 0) {
        console.warn(`No se agregaron documentos para el postulante ${nombrePostulante}`);
      }

      console.log(`Se agregaron ${documentosAgregados} de ${documentos.length} documentos al ZIP del postulante`);
      archive.finalize();
    });
  }
} 