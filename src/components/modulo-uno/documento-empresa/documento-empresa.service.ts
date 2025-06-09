import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateDocumentoEmpresaDto } from './dto/create-documento-empresa.dto';
import { UpdateDocumentoEmpresaDto } from './dto/update-documento-empresa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentoEmpresa } from './entities/documento-empresa.entity';

@Injectable()
export class DocumentoEmpresaService {
  private readonly logger = new Logger(DocumentoEmpresaService.name);

  constructor(
    @InjectRepository(DocumentoEmpresa)
    private documentoEmpresaRepository: Repository<DocumentoEmpresa>,
  ) {}

  async create(createDocumentoEmpresaDto: CreateDocumentoEmpresaDto) {
    try {
      this.logger.log('Creando nuevo documento de empresa');
      
      const documento = this.documentoEmpresaRepository.create(createDocumentoEmpresaDto);
      const savedDocumento = await this.documentoEmpresaRepository.save(documento);

      this.logger.log(`Documento de empresa creado exitosamente con ID: ${savedDocumento.documentoEmpresaID}`);
      
      return {
        status: 200,
        message: 'Documento de empresa creado exitosamente',
        data: savedDocumento,
      };
    } catch (error) {
      this.logger.error(`Error al crear documento de empresa: ${error.message}`, error.stack);
      throw new BadRequestException({
        status: 'error',
        message: 'Error al crear el documento de empresa',
        error: error.message,
      });
    }
  }

  async findAll() {
    try {
      this.logger.log('Obteniendo todos los documentos de empresa');
      
      const documentos = await this.documentoEmpresaRepository.find({
        relations: ['empresa'],
        order: { fechaSubida: 'DESC' },
      });

      this.logger.log(`Se encontraron ${documentos.length} documentos de empresa`);
      
      return {
        status: 200,
        message: 'Documentos de empresa obtenidos correctamente',
        data: documentos,
        count: documentos.length,
      };
    } catch (error) {
      this.logger.error(`Error al obtener documentos de empresa: ${error.message}`, error.stack);
      throw new BadRequestException({
        status: 'error',
        message: 'Error al obtener los documentos de empresa',
        error: error.message,
      });
    }
  }

  async findOne(id: string) {
    try {
      this.logger.log(`Buscando documento de empresa con ID: ${id}`);
      
      const documento = await this.documentoEmpresaRepository.findOne({
        where: { documentoEmpresaID: id },
        relations: ['empresa'],
      });

      if (!documento) {
        this.logger.warn(`Documento de empresa con ID ${id} no encontrado`);
        throw new NotFoundException({
          status: 'error',
          message: `Documento de empresa con ID ${id} no encontrado`,
        });
      }

      this.logger.log(`Documento de empresa encontrado: ${documento.nombreArchivo}`);
      
      return {
        status: 200,
        message: 'Documento de empresa obtenido correctamente',
        data: documento,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error al obtener documento de empresa: ${error.message}`, error.stack);
      throw new BadRequestException({
        status: 'error',
        message: 'Error al obtener el documento de empresa',
        error: error.message,
      });
    }
  }

  async findByEmpresa(empresaID: string) {
    try {
      this.logger.log(`Buscando documentos de la empresa con ID: ${empresaID}`);
      
      const documentos = await this.documentoEmpresaRepository.find({
        where: { empresaID },
        order: { fechaSubida: 'DESC' },
      });

      this.logger.log(`Se encontraron ${documentos.length} documentos para la empresa ${empresaID}`);
      
      return {
        status: 200,
        message: `Documentos de la empresa obtenidos correctamente`,
        data: documentos,
        count: documentos.length,
      };
    } catch (error) {
      this.logger.error(`Error al obtener documentos por empresa: ${error.message}`, error.stack);
      throw new BadRequestException({
        status: 'error',
        message: 'Error al obtener los documentos por empresa',
        error: error.message,
      });
    }
  }

  async update(id: string, updateDocumentoEmpresaDto: UpdateDocumentoEmpresaDto) {
    try {
      this.logger.log(`Actualizando documento de empresa con ID: ${id}`);
      
      const documento = await this.documentoEmpresaRepository.findOne({
        where: { documentoEmpresaID: id },
      });

      if (!documento) {
        this.logger.warn(`Documento de empresa con ID ${id} no encontrado para actualizar`);
        throw new NotFoundException({
          status: 'error',
          message: `Documento de empresa con ID ${id} no encontrado`,
        });
      }

      await this.documentoEmpresaRepository.update(id, updateDocumentoEmpresaDto);
      const updatedDocumento = await this.documentoEmpresaRepository.findOne({
        where: { documentoEmpresaID: id },
        relations: ['empresa'],
      });

      this.logger.log(`Documento de empresa actualizado exitosamente: ${updatedDocumento.nombreArchivo}`);
      
      return {
        status: 200,
        message: 'Documento de empresa actualizado exitosamente',
        data: updatedDocumento,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error al actualizar documento de empresa: ${error.message}`, error.stack);
      throw new BadRequestException({
        status: 'error',
        message: 'Error al actualizar el documento de empresa',
        error: error.message,
      });
    }
  }

  async remove(id: string) {
    try {
      this.logger.log(`Eliminando documento de empresa con ID: ${id}`);
      
      const documento = await this.documentoEmpresaRepository.findOne({
        where: { documentoEmpresaID: id },
      });

      if (!documento) {
        this.logger.warn(`Documento de empresa con ID ${id} no encontrado para eliminar`);
        throw new NotFoundException({
          status: 'error',
          message: `Documento de empresa con ID ${id} no encontrado`,
        });
      }

      await this.documentoEmpresaRepository.remove(documento);

      this.logger.log(`Documento de empresa eliminado exitosamente: ${documento.nombreArchivo}`);
      
      return {
        status: 200,
        message: 'Documento de empresa eliminado exitosamente',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error al eliminar documento de empresa: ${error.message}`, error.stack);
      throw new BadRequestException({
        status: 'error',
        message: 'Error al eliminar el documento de empresa',
        error: error.message,
      });
    }
  }
}
