import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDocumentoPostulanteDto } from './dto/create-documento-postulante.dto';
import { UpdateDocumentoPostulanteDto } from './dto/update-documento-postulante.dto';
import { DocumentoPostulante } from './entities/documento-postulante.entity';

@Injectable()
export class DocumentoPostulanteService {
  private readonly logger = new Logger(DocumentoPostulanteService.name);

  constructor(
    @InjectRepository(DocumentoPostulante)
    private documentoPostulanteRepository: Repository<DocumentoPostulante>,
  ) {}

  async create(createDocumentoPostulanteDto: CreateDocumentoPostulanteDto) {
    try {
      this.logger.log('Creando nuevo documento de postulante');
      const documento = this.documentoPostulanteRepository.create(createDocumentoPostulanteDto);
      const resultado = await this.documentoPostulanteRepository.save(documento);
      
      this.logger.log(`Documento de postulante creado con ID: ${resultado.documentoPostulanteID}`);
      return {
        status: 200,
        message: 'Documento de postulante creado exitosamente',
        data: resultado
      };
    } catch (error) {
      this.logger.error(`Error al crear documento de postulante: ${error.message}`);
      throw new HttpException(
        'Error interno del servidor al crear documento de postulante',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll() {
    try {
      this.logger.log('Obteniendo todos los documentos de postulantes');
      const documentos = await this.documentoPostulanteRepository.find({
        relations: ['postulante']
      });
      
      this.logger.log(`Se encontraron ${documentos.length} documentos de postulantes`);
      return {
        status: 200,
        message: 'Documentos de postulantes obtenidos exitosamente',
        count: documentos.length,
        data: documentos
      };
    } catch (error) {
      this.logger.error(`Error al obtener documentos de postulantes: ${error.message}`);
      throw new HttpException(
        'Error interno del servidor al obtener documentos de postulantes',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(id: string) {
    try {
      this.logger.log(`Buscando documento de postulante con ID: ${id}`);
      const documento = await this.documentoPostulanteRepository.findOne({
        where: { documentoPostulanteID: id },
        relations: ['postulante']
      });

      if (!documento) {
        this.logger.warn(`Documento de postulante no encontrado con ID: ${id}`);
        throw new HttpException(
          'Documento de postulante no encontrado',
          HttpStatus.NOT_FOUND
        );
      }

      this.logger.log(`Documento de postulante encontrado: ${id}`);
      return {
        status: 200,
        message: 'Documento de postulante encontrado exitosamente',
        data: documento
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error al buscar documento de postulante: ${error.message}`);
      throw new HttpException(
        'Error interno del servidor al buscar documento de postulante',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: string, updateDocumentoPostulanteDto: UpdateDocumentoPostulanteDto) {
    try {
      this.logger.log(`Actualizando documento de postulante con ID: ${id}`);
      
      const documento = await this.documentoPostulanteRepository.findOne({
        where: { documentoPostulanteID: id }
      });

      if (!documento) {
        this.logger.warn(`Documento de postulante no encontrado para actualizar con ID: ${id}`);
        throw new HttpException(
          'Documento de postulante no encontrado',
          HttpStatus.NOT_FOUND
        );
      }

      await this.documentoPostulanteRepository.update(id, updateDocumentoPostulanteDto);
      const documentoActualizado = await this.documentoPostulanteRepository.findOne({
        where: { documentoPostulanteID: id },
        relations: ['postulante']
      });

      this.logger.log(`Documento de postulante actualizado exitosamente: ${id}`);
      return {
        status: 200,
        message: 'Documento de postulante actualizado exitosamente',
        data: documentoActualizado
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error al actualizar documento de postulante: ${error.message}`);
      throw new HttpException(
        'Error interno del servidor al actualizar documento de postulante',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(id: string) {
    try {
      this.logger.log(`Eliminando documento de postulante con ID: ${id}`);
      
      const documento = await this.documentoPostulanteRepository.findOne({
        where: { documentoPostulanteID: id }
      });

      if (!documento) {
        this.logger.warn(`Documento de postulante no encontrado para eliminar con ID: ${id}`);
        throw new HttpException(
          'Documento de postulante no encontrado',
          HttpStatus.NOT_FOUND
        );
      }

      await this.documentoPostulanteRepository.remove(documento);
      
      this.logger.log(`Documento de postulante eliminado exitosamente: ${id}`);
      return {
        status: 200,
        message: 'Documento de postulante eliminado exitosamente'
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error al eliminar documento de postulante: ${error.message}`);
      throw new HttpException(
        'Error interno del servidor al eliminar documento de postulante',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findByPostulante(postulanteID: string) {
    try {
      this.logger.log(`Buscando documentos del postulante: ${postulanteID}`);
      const documentos = await this.documentoPostulanteRepository.find({
        where: { postulanteID },
        relations: ['postulante']
      });

      this.logger.log(`Se encontraron ${documentos.length} documentos para el postulante: ${postulanteID}`);
      return {
        status: 200,
        message: 'Documentos del postulante obtenidos exitosamente',
        count: documentos.length,
        data: documentos
      };
    } catch (error) {
      this.logger.error(`Error al buscar documentos del postulante: ${error.message}`);
      throw new HttpException(
        'Error interno del servidor al buscar documentos del postulante',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
