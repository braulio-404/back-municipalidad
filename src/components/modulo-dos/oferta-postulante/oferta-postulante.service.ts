import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOfertaPostulanteDto } from './dto/create-oferta-postulante.dto';
import { UpdateOfertaPostulanteDto } from './dto/update-oferta-postulante.dto';
import { OfertaPostulante } from './entities/oferta-postulante.entity';

@Injectable()
export class OfertaPostulanteService {
  private readonly logger = new Logger(OfertaPostulanteService.name);

  constructor(
    @InjectRepository(OfertaPostulante)
    private ofertaPostulanteRepository: Repository<OfertaPostulante>,
  ) {}

  async create(createOfertaPostulanteDto: CreateOfertaPostulanteDto) {
    try {
      this.logger.log('Creando nueva postulación a oferta');
      
      // Verificar si ya existe la postulación (llave compuesta)
      const existePostulacion = await this.ofertaPostulanteRepository.findOne({
        where: {
          ofertaTrabajoID: createOfertaPostulanteDto.ofertaTrabajoID,
          postulanteID: createOfertaPostulanteDto.postulanteID
        }
      });

      if (existePostulacion) {
        this.logger.warn(`Postulación ya existe para oferta ${createOfertaPostulanteDto.ofertaTrabajoID} y postulante ${createOfertaPostulanteDto.postulanteID}`);
        throw new HttpException(
          'El postulante ya se ha postulado a esta oferta',
          HttpStatus.CONFLICT
        );
      }

      const postulacion = this.ofertaPostulanteRepository.create(createOfertaPostulanteDto);
      const resultado = await this.ofertaPostulanteRepository.save(postulacion);
      
      this.logger.log(`Postulación creada: Oferta ${resultado.ofertaTrabajoID} - Postulante ${resultado.postulanteID}`);
      return {
        status: 200,
        message: 'Postulación creada exitosamente',
        data: resultado
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error al crear postulación: ${error.message}`);
      throw new HttpException(
        'Error interno del servidor al crear postulación',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll() {
    try {
      this.logger.log('Obteniendo todas las postulaciones');
      const postulaciones = await this.ofertaPostulanteRepository.find({
        relations: ['ofertaTrabajo', 'postulante']
      });
      
      this.logger.log(`Se encontraron ${postulaciones.length} postulaciones`);
      return {
        status: 200,
        message: 'Postulaciones obtenidas exitosamente',
        count: postulaciones.length,
        data: postulaciones
      };
    } catch (error) {
      this.logger.error(`Error al obtener postulaciones: ${error.message}`);
      throw new HttpException(
        'Error interno del servidor al obtener postulaciones',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(ofertaTrabajoID: string, postulanteID: string) {
    try {
      this.logger.log(`Buscando postulación: Oferta ${ofertaTrabajoID} - Postulante ${postulanteID}`);
      const postulacion = await this.ofertaPostulanteRepository.findOne({
        where: { ofertaTrabajoID, postulanteID },
        relations: ['ofertaTrabajo', 'postulante']
      });

      if (!postulacion) {
        this.logger.warn(`Postulación no encontrada: Oferta ${ofertaTrabajoID} - Postulante ${postulanteID}`);
        throw new HttpException(
          'Postulación no encontrada',
          HttpStatus.NOT_FOUND
        );
      }

      this.logger.log(`Postulación encontrada: Oferta ${ofertaTrabajoID} - Postulante ${postulanteID}`);
      return {
        status: 200,
        message: 'Postulación encontrada exitosamente',
        data: postulacion
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error al buscar postulación: ${error.message}`);
      throw new HttpException(
        'Error interno del servidor al buscar postulación',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(ofertaTrabajoID: string, postulanteID: string, updateOfertaPostulanteDto: UpdateOfertaPostulanteDto) {
    try {
      this.logger.log(`Actualizando postulación: Oferta ${ofertaTrabajoID} - Postulante ${postulanteID}`);
      
      const postulacion = await this.ofertaPostulanteRepository.findOne({
        where: { ofertaTrabajoID, postulanteID }
      });

      if (!postulacion) {
        this.logger.warn(`Postulación no encontrada para actualizar: Oferta ${ofertaTrabajoID} - Postulante ${postulanteID}`);
        throw new HttpException(
          'Postulación no encontrada',
          HttpStatus.NOT_FOUND
        );
      }

      await this.ofertaPostulanteRepository.update(
        { ofertaTrabajoID, postulanteID },
        updateOfertaPostulanteDto
      );
      
      const postulacionActualizada = await this.ofertaPostulanteRepository.findOne({
        where: { ofertaTrabajoID, postulanteID },
        relations: ['ofertaTrabajo', 'postulante']
      });

      this.logger.log(`Postulación actualizada: Oferta ${ofertaTrabajoID} - Postulante ${postulanteID}`);
      return {
        status: 200,
        message: 'Postulación actualizada exitosamente',
        data: postulacionActualizada
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error al actualizar postulación: ${error.message}`);
      throw new HttpException(
        'Error interno del servidor al actualizar postulación',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(ofertaTrabajoID: string, postulanteID: string) {
    try {
      this.logger.log(`Eliminando postulación: Oferta ${ofertaTrabajoID} - Postulante ${postulanteID}`);
      
      const postulacion = await this.ofertaPostulanteRepository.findOne({
        where: { ofertaTrabajoID, postulanteID }
      });

      if (!postulacion) {
        this.logger.warn(`Postulación no encontrada para eliminar: Oferta ${ofertaTrabajoID} - Postulante ${postulanteID}`);
        throw new HttpException(
          'Postulación no encontrada',
          HttpStatus.NOT_FOUND
        );
      }

      await this.ofertaPostulanteRepository.remove(postulacion);
      
      this.logger.log(`Postulación eliminada: Oferta ${ofertaTrabajoID} - Postulante ${postulanteID}`);
      return {
        status: 200,
        message: 'Postulación eliminada exitosamente'
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error al eliminar postulación: ${error.message}`);
      throw new HttpException(
        'Error interno del servidor al eliminar postulación',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findByOferta(ofertaTrabajoID: string) {
    try {
      this.logger.log(`Buscando postulaciones de la oferta: ${ofertaTrabajoID}`);
      const postulaciones = await this.ofertaPostulanteRepository.find({
        where: { ofertaTrabajoID },
        relations: ['ofertaTrabajo', 'postulante']
      });

      this.logger.log(`Se encontraron ${postulaciones.length} postulaciones para la oferta: ${ofertaTrabajoID}`);
      return {
        status: 200,
        message: 'Postulaciones de la oferta obtenidas exitosamente',
        count: postulaciones.length,
        data: postulaciones
      };
    } catch (error) {
      this.logger.error(`Error al buscar postulaciones de la oferta: ${error.message}`);
      throw new HttpException(
        'Error interno del servidor al buscar postulaciones de la oferta',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findByPostulante(postulanteID: string) {
    try {
      this.logger.log(`Buscando postulaciones del postulante: ${postulanteID}`);
      const postulaciones = await this.ofertaPostulanteRepository.find({
        where: { postulanteID },
        relations: ['ofertaTrabajo', 'postulante']
      });

      this.logger.log(`Se encontraron ${postulaciones.length} postulaciones para el postulante: ${postulanteID}`);
      return {
        status: 200,
        message: 'Postulaciones del postulante obtenidas exitosamente',
        count: postulaciones.length,
        data: postulaciones
      };
    } catch (error) {
      this.logger.error(`Error al buscar postulaciones del postulante: ${error.message}`);
      throw new HttpException(
        'Error interno del servidor al buscar postulaciones del postulante',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
