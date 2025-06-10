import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProyectoEmpresaDto } from './dto/create-proyecto-empresa.dto';
import { UpdateProyectoEmpresaDto } from './dto/update-proyecto-empresa.dto';
import { ProyectoEmpresa } from './entities/proyecto-empresa.entity';

@Injectable()
export class ProyectoEmpresaService {
  private readonly logger = new Logger(ProyectoEmpresaService.name);

  constructor(
    @InjectRepository(ProyectoEmpresa)
    private proyectoEmpresaRepository: Repository<ProyectoEmpresa>,
  ) {}

  async create(createProyectoEmpresaDto: CreateProyectoEmpresaDto) {
    try {
      this.logger.log('Creando nueva relación proyecto-empresa');
      
      // Verificar si ya existe la relación
      const existingRelation = await this.proyectoEmpresaRepository.findOne({
        where: {
          proyectoID: createProyectoEmpresaDto.proyectoID,
          empresaID: createProyectoEmpresaDto.empresaID,
        },
      });

      if (existingRelation) {
        this.logger.warn(`La relación proyecto-empresa ya existe: ${createProyectoEmpresaDto.proyectoID} - ${createProyectoEmpresaDto.empresaID}`);
        throw new BadRequestException({
          status: 'error',
          message: 'La empresa ya está postulada a este proyecto',
        });
      }

      const proyectoEmpresa = this.proyectoEmpresaRepository.create(createProyectoEmpresaDto);
      const savedRelation = await this.proyectoEmpresaRepository.save(proyectoEmpresa);

      this.logger.log(`Relación proyecto-empresa creada exitosamente: ${savedRelation.proyectoID} - ${savedRelation.empresaID}`);
      
      return {
        status: 200,
        message: 'Postulación de empresa a proyecto creada exitosamente',
        data: savedRelation,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error al crear relación proyecto-empresa: ${error.message}`, error.stack);
      throw new BadRequestException({
        status: 'error',
        message: 'Error al crear la postulación de empresa a proyecto',
        error: error.message,
      });
    }
  }

  async findAll() {
    try {
      this.logger.log('Obteniendo todas las relaciones proyecto-empresa');
      
      const relaciones = await this.proyectoEmpresaRepository.find({
        relations: ['proyecto', 'empresa'],
        order: { proyectoID: 'ASC', empresaID: 'ASC' },
      });

      this.logger.log(`Se encontraron ${relaciones.length} relaciones proyecto-empresa`);
      
      return {
        status: 200,
        message: 'Relaciones proyecto-empresa obtenidas correctamente',
        data: relaciones,
        count: relaciones.length,
      };
    } catch (error) {
      this.logger.error(`Error al obtener relaciones proyecto-empresa: ${error.message}`, error.stack);
      throw new BadRequestException({
        status: 'error',
        message: 'Error al obtener las relaciones proyecto-empresa',
        error: error.message,
      });
    }
  }

  async findOne(proyectoID: string, empresaID: string) {
    try {
      this.logger.log(`Buscando relación proyecto-empresa: ${proyectoID} - ${empresaID}`);
      
      const relacion = await this.proyectoEmpresaRepository.findOne({
        where: { proyectoID, empresaID },
        relations: ['proyecto', 'empresa'],
      });

      if (!relacion) {
        this.logger.warn(`Relación proyecto-empresa no encontrada: ${proyectoID} - ${empresaID}`);
        throw new NotFoundException({
          status: 'error',
          message: `Relación proyecto-empresa no encontrada`,
        });
      }

      this.logger.log(`Relación proyecto-empresa encontrada: ${proyectoID} - ${empresaID}`);
      
      return {
        status: 200,
        message: 'Relación proyecto-empresa obtenida correctamente',
        data: relacion,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error al obtener relación proyecto-empresa: ${error.message}`, error.stack);
      throw new BadRequestException({
        status: 'error',
        message: 'Error al obtener la relación proyecto-empresa',
        error: error.message,
      });
    }
  }

  async update(proyectoID: string, empresaID: string, updateProyectoEmpresaDto: UpdateProyectoEmpresaDto) {
    try {
      this.logger.log(`Actualizando relación proyecto-empresa: ${proyectoID} - ${empresaID}`);
      
      const relacion = await this.proyectoEmpresaRepository.findOne({
        where: { proyectoID, empresaID },
      });

      if (!relacion) {
        this.logger.warn(`Relación proyecto-empresa no encontrada para actualizar: ${proyectoID} - ${empresaID}`);
        throw new NotFoundException({
          status: 'error',
          message: `Relación proyecto-empresa no encontrada`,
        });
      }

      await this.proyectoEmpresaRepository.update({ proyectoID, empresaID }, updateProyectoEmpresaDto);
      const updatedRelation = await this.proyectoEmpresaRepository.findOne({
        where: { proyectoID, empresaID },
        relations: ['proyecto', 'empresa'],
      });

      this.logger.log(`Relación proyecto-empresa actualizada exitosamente: ${proyectoID} - ${empresaID}`);
      
      return {
        status: 200,
        message: 'Relación proyecto-empresa actualizada exitosamente',
        data: updatedRelation,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error al actualizar relación proyecto-empresa: ${error.message}`, error.stack);
      throw new BadRequestException({
        status: 'error',
        message: 'Error al actualizar la relación proyecto-empresa',
        error: error.message,
      });
    }
  }

  async remove(proyectoID: string, empresaID: string) {
    try {
      this.logger.log(`Eliminando relación proyecto-empresa: ${proyectoID} - ${empresaID}`);
      
      const relacion = await this.proyectoEmpresaRepository.findOne({
        where: { proyectoID, empresaID },
      });

      if (!relacion) {
        this.logger.warn(`Relación proyecto-empresa no encontrada para eliminar: ${proyectoID} - ${empresaID}`);
        throw new NotFoundException({
          status: 'error',
          message: `Relación proyecto-empresa no encontrada`,
        });
      }

      await this.proyectoEmpresaRepository.remove(relacion);

      this.logger.log(`Relación proyecto-empresa eliminada exitosamente: ${proyectoID} - ${empresaID}`);
      
      return {
        status: 200,
        message: 'Relación proyecto-empresa eliminada exitosamente',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error al eliminar relación proyecto-empresa: ${error.message}`, error.stack);
      throw new BadRequestException({
        status: 'error',
        message: 'Error al eliminar la relación proyecto-empresa',
        error: error.message,
      });
    }
  }

  async findByProyecto(proyectoID: string) {
    try {
      this.logger.log(`Buscando empresas del proyecto: ${proyectoID}`);
      
      const relaciones = await this.proyectoEmpresaRepository.find({
        where: { proyectoID },
        relations: ['empresa'],
        order: { empresaID: 'ASC' },
      });

      this.logger.log(`Se encontraron ${relaciones.length} empresas para el proyecto ${proyectoID}`);
      
      return {
        status: 200,
        message: `Empresas del proyecto obtenidas correctamente`,
        data: relaciones,
        count: relaciones.length,
      };
    } catch (error) {
      this.logger.error(`Error al obtener empresas por proyecto: ${error.message}`, error.stack);
      throw new BadRequestException({
        status: 'error',
        message: 'Error al obtener las empresas por proyecto',
        error: error.message,
      });
    }
  }

  async findByEmpresa(empresaID: string) {
    try {
      this.logger.log(`Buscando proyectos de la empresa: ${empresaID}`);
      
      const relaciones = await this.proyectoEmpresaRepository.find({
        where: { empresaID },
        relations: ['proyecto'],
        order: { proyectoID: 'ASC' },
      });

      this.logger.log(`Se encontraron ${relaciones.length} proyectos para la empresa ${empresaID}`);
      
      return {
        status: 200,
        message: `Proyectos de la empresa obtenidos correctamente`,
        data: relaciones,
        count: relaciones.length,
      };
    } catch (error) {
      this.logger.error(`Error al obtener proyectos por empresa: ${error.message}`, error.stack);
      throw new BadRequestException({
        status: 'error',
        message: 'Error al obtener los proyectos por empresa',
        error: error.message,
      });
    }
  }
}
