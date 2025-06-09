import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { Proyecto } from './entities/proyecto.entity';

@Injectable()
export class ProyectoService {
  private readonly logger = new Logger(ProyectoService.name);

  constructor(
    @InjectRepository(Proyecto)
    private proyectoRepository: Repository<Proyecto>,
  ) {}

  async create(createProyectoDto: CreateProyectoDto) {
    try {
      this.logger.log('Creando nuevo proyecto');
      
      const proyecto = this.proyectoRepository.create(createProyectoDto);
      const savedProyecto = await this.proyectoRepository.save(proyecto);

      this.logger.log(`Proyecto creado exitosamente con ID: ${savedProyecto.proyectoID}`);
      
      return {
        status: 200,
        message: 'Proyecto creado exitosamente',
        data: savedProyecto,
      };
    } catch (error) {
      this.logger.error(`Error al crear proyecto: ${error.message}`, error.stack);
      throw new BadRequestException({
        status: 'error',
        message: 'Error al crear el proyecto',
        error: error.message,
      });
    }
  }

  async findAll() {
    try {
      this.logger.log('Obteniendo todos los proyectos');
      
      const proyectos = await this.proyectoRepository.find({
        relations: ['proyectoEmpresa'],
        order: { fechaInicio: 'DESC' },
      });

      this.logger.log(`Se encontraron ${proyectos.length} proyectos`);
      
      return {
        status: 200,
        message: 'Proyectos obtenidos correctamente',
        data: proyectos,
        count: proyectos.length,
      };
    } catch (error) {
      this.logger.error(`Error al obtener proyectos: ${error.message}`, error.stack);
      throw new BadRequestException({
        status: 'error',
        message: 'Error al obtener los proyectos',
        error: error.message,
      });
    }
  }

  async findOne(id: string) {
    try {
      this.logger.log(`Buscando proyecto con ID: ${id}`);
      
      const proyecto = await this.proyectoRepository.findOne({
        where: { proyectoID: id },
        relations: ['proyectoEmpresa'],
      });

      if (!proyecto) {
        this.logger.warn(`Proyecto con ID ${id} no encontrado`);
        throw new NotFoundException({
          status: 'error',
          message: `Proyecto con ID ${id} no encontrado`,
        });
      }

      this.logger.log(`Proyecto encontrado: ${proyecto.titulo}`);
      
      return {
        status: 200,
        message: 'Proyecto obtenido correctamente',
        data: proyecto,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error al obtener proyecto: ${error.message}`, error.stack);
      throw new BadRequestException({
        status: 'error',
        message: 'Error al obtener el proyecto',
        error: error.message,
      });
    }
  }

  async update(id: string, updateProyectoDto: UpdateProyectoDto) {
    try {
      this.logger.log(`Actualizando proyecto con ID: ${id}`);
      
      const proyecto = await this.proyectoRepository.findOne({
        where: { proyectoID: id },
      });

      if (!proyecto) {
        this.logger.warn(`Proyecto con ID ${id} no encontrado para actualizar`);
        throw new NotFoundException({
          status: 'error',
          message: `Proyecto con ID ${id} no encontrado`,
        });
      }

      await this.proyectoRepository.update(id, updateProyectoDto);
      const updatedProyecto = await this.proyectoRepository.findOne({
        where: { proyectoID: id },
        relations: ['proyectoEmpresa'],
      });

      this.logger.log(`Proyecto actualizado exitosamente: ${updatedProyecto.titulo}`);
      
      return {
        status: 200,
        message: 'Proyecto actualizado exitosamente',
        data: updatedProyecto,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error al actualizar proyecto: ${error.message}`, error.stack);
      throw new BadRequestException({
        status: 'error',
        message: 'Error al actualizar el proyecto',
        error: error.message,
      });
    }
  }

  async remove(id: string) {
    try {
      this.logger.log(`Eliminando proyecto con ID: ${id}`);
      
      const proyecto = await this.proyectoRepository.findOne({
        where: { proyectoID: id },
      });

      if (!proyecto) {
        this.logger.warn(`Proyecto con ID ${id} no encontrado para eliminar`);
        throw new NotFoundException({
          status: 'error',
          message: `Proyecto con ID ${id} no encontrado`,
        });
      }

      await this.proyectoRepository.remove(proyecto);

      this.logger.log(`Proyecto eliminado exitosamente: ${proyecto.titulo}`);
      
      return {
        status: 200,
        message: 'Proyecto eliminado exitosamente',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error al eliminar proyecto: ${error.message}`, error.stack);
      throw new BadRequestException({
        status: 'error',
        message: 'Error al eliminar el proyecto',
        error: error.message,
      });
    }
  }

  async findByEstado(estado: string) {
    try {
      this.logger.log(`Buscando proyectos con estado: ${estado}`);
      
      const proyectos = await this.proyectoRepository.find({
        where: { estado },
        relations: ['proyectoEmpresa'],
        order: { fechaInicio: 'DESC' },
      });

      this.logger.log(`Se encontraron ${proyectos.length} proyectos con estado ${estado}`);
      
      return {
        status: 200,
        message: `Proyectos con estado ${estado} obtenidos correctamente`,
        data: proyectos,
        count: proyectos.length,
      };
    } catch (error) {
      this.logger.error(`Error al obtener proyectos por estado: ${error.message}`, error.stack);
      throw new BadRequestException({
        status: 'error',
        message: 'Error al obtener proyectos por estado',
        error: error.message,
      });
    }
  }
}
