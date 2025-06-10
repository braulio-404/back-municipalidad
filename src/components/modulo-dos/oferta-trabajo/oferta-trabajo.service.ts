import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOfertaTrabajoDto } from './dto/create-oferta-trabajo.dto';
import { UpdateOfertaTrabajoDto } from './dto/update-oferta-trabajo.dto';
import { OfertaTrabajo } from './entities/oferta-trabajo.entity';

@Injectable()
export class OfertaTrabajoService {
  private readonly logger = new Logger(OfertaTrabajoService.name);

  constructor(
    @InjectRepository(OfertaTrabajo)
    private ofertaTrabajoRepository: Repository<OfertaTrabajo>,
  ) {}

  async create(createOfertaTrabajoDto: CreateOfertaTrabajoDto) {
    try {
      this.logger.log('Creando nueva oferta de trabajo');
      const oferta = this.ofertaTrabajoRepository.create(createOfertaTrabajoDto);
      const resultado = await this.ofertaTrabajoRepository.save(oferta);
      
      this.logger.log(`Oferta de trabajo creada con ID: ${resultado.ofertaTrabajoID}`);
      return {
        status: 200,
        message: 'Oferta de trabajo creada exitosamente',
        data: resultado
      };
    } catch (error) {
      this.logger.error(`Error al crear oferta de trabajo: ${error.message}`);
      throw new HttpException(
        'Error interno del servidor al crear oferta de trabajo',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll() {
    try {
      this.logger.log('Obteniendo todas las ofertas de trabajo');
      const ofertas = await this.ofertaTrabajoRepository.find({
        relations: ['postulantes']
      });
      
      this.logger.log(`Se encontraron ${ofertas.length} ofertas de trabajo`);
      return {
        status: 200,
        message: 'Ofertas de trabajo obtenidas exitosamente',
        count: ofertas.length,
        data: ofertas
      };
    } catch (error) {
      this.logger.error(`Error al obtener ofertas de trabajo: ${error.message}`);
      throw new HttpException(
        'Error interno del servidor al obtener ofertas de trabajo',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(id: string) {
    try {
      this.logger.log(`Buscando oferta de trabajo con ID: ${id}`);
      const oferta = await this.ofertaTrabajoRepository.findOne({
        where: { ofertaTrabajoID: id },
        relations: ['postulantes']
      });

      if (!oferta) {
        this.logger.warn(`Oferta de trabajo no encontrada con ID: ${id}`);
        throw new HttpException(
          'Oferta de trabajo no encontrada',
          HttpStatus.NOT_FOUND
        );
      }

      this.logger.log(`Oferta de trabajo encontrada: ${id}`);
      return {
        status: 200,
        message: 'Oferta de trabajo encontrada exitosamente',
        data: oferta
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error al buscar oferta de trabajo: ${error.message}`);
      throw new HttpException(
        'Error interno del servidor al buscar oferta de trabajo',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: string, updateOfertaTrabajoDto: UpdateOfertaTrabajoDto) {
    try {
      this.logger.log(`Actualizando oferta de trabajo con ID: ${id}`);
      
      const oferta = await this.ofertaTrabajoRepository.findOne({
        where: { ofertaTrabajoID: id }
      });

      if (!oferta) {
        this.logger.warn(`Oferta de trabajo no encontrada para actualizar con ID: ${id}`);
        throw new HttpException(
          'Oferta de trabajo no encontrada',
          HttpStatus.NOT_FOUND
        );
      }

      await this.ofertaTrabajoRepository.update(id, updateOfertaTrabajoDto);
      const ofertaActualizada = await this.ofertaTrabajoRepository.findOne({
        where: { ofertaTrabajoID: id },
        relations: ['postulantes']
      });

      this.logger.log(`Oferta de trabajo actualizada exitosamente: ${id}`);
      return {
        status: 200,
        message: 'Oferta de trabajo actualizada exitosamente',
        data: ofertaActualizada
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error al actualizar oferta de trabajo: ${error.message}`);
      throw new HttpException(
        'Error interno del servidor al actualizar oferta de trabajo',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(id: string) {
    try {
      this.logger.log(`Eliminando oferta de trabajo con ID: ${id}`);
      
      const oferta = await this.ofertaTrabajoRepository.findOne({
        where: { ofertaTrabajoID: id }
      });

      if (!oferta) {
        this.logger.warn(`Oferta de trabajo no encontrada para eliminar con ID: ${id}`);
        throw new HttpException(
          'Oferta de trabajo no encontrada',
          HttpStatus.NOT_FOUND
        );
      }

      await this.ofertaTrabajoRepository.remove(oferta);
      
      this.logger.log(`Oferta de trabajo eliminada exitosamente: ${id}`);
      return {
        status: 200,
        message: 'Oferta de trabajo eliminada exitosamente'
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error al eliminar oferta de trabajo: ${error.message}`);
      throw new HttpException(
        'Error interno del servidor al eliminar oferta de trabajo',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findByEstado(estado: string) {
    try {
      this.logger.log(`Buscando ofertas de trabajo con estado: ${estado}`);
      const ofertas = await this.ofertaTrabajoRepository.find({
        where: { estado },
        relations: ['postulantes']
      });

      this.logger.log(`Se encontraron ${ofertas.length} ofertas con estado: ${estado}`);
      return {
        status: 200,
        message: 'Ofertas de trabajo por estado obtenidas exitosamente',
        count: ofertas.length,
        data: ofertas
      };
    } catch (error) {
      this.logger.error(`Error al buscar ofertas por estado: ${error.message}`);
      throw new HttpException(
        'Error interno del servidor al buscar ofertas por estado',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
