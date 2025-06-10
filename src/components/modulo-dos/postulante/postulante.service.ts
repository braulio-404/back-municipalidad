import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostulanteDto } from './dto/create-postulante.dto';
import { UpdatePostulanteDto } from './dto/update-postulante.dto';
import { Postulante } from './entities/postulante.entity';

@Injectable()
export class PostulanteService {
  private readonly logger = new Logger(PostulanteService.name);

  constructor(
    @InjectRepository(Postulante)
    private postulanteRepository: Repository<Postulante>,
  ) {}

  async create(createPostulanteDto: CreatePostulanteDto) {
    try {
      this.logger.log('Creando nuevo postulante');
      
      // Verificar si ya existe una postulación con el mismo RUT y formulario_id
      const existePostulacion = await this.postulanteRepository.findOne({
        where: { 
          rut: createPostulanteDto.rut,
          formulario_id: createPostulanteDto.formulario_id
        }
      });

      if (existePostulacion) {
        this.logger.warn(`Ya existe una postulación para el RUT ${createPostulanteDto.rut} en el formulario ${createPostulanteDto.formulario_id}`);
        throw new HttpException(
          'Ya estás postulando a este cargo',
          HttpStatus.CONFLICT
        );
      }

      // Separar documentos del DTO principal
      const { documentos, ...postulanteData } = createPostulanteDto;

      // Crear el postulante sin documentos
      const postulante = this.postulanteRepository.create(postulanteData);
      const resultado = await this.postulanteRepository.save(postulante);
      
      this.logger.log(`Postulante creado con ID: ${resultado.postulanteID}`);
      
      // TODO: Aquí se pueden procesar los documentos con el servicio correspondiente
      // Los documentos se manejarán por separado en el controlador o mediante otro servicio
      
      return {
        status: 200,
        message: 'Postulante creado exitosamente',
        data: resultado,
        documentos: documentos || [] // Retornar los documentos para procesamiento posterior
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error al crear postulante: ${error.message}`);
      throw new HttpException(
        'Error interno del servidor al crear postulante',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll() {
    try {
      this.logger.log('Obteniendo todos los postulantes');
      const postulantes = await this.postulanteRepository.find({
        relations: ['documentos', 'formulario'],
        order: { fechaRegistro: 'DESC' }
      });
      
      this.logger.log(`Se encontraron ${postulantes.length} postulantes`);
      return {
        status: 200,
        message: 'Postulantes obtenidos exitosamente',
        count: postulantes.length,
        data: postulantes
      };
    } catch (error) {
      this.logger.error(`Error al obtener postulantes: ${error.message}`);
      throw new HttpException(
        'Error interno del servidor al obtener postulantes',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(id: string) {
    try {
      this.logger.log(`Buscando postulante con ID: ${id}`);
      const postulante = await this.postulanteRepository.findOne({
        where: { postulanteID: id },
        relations: ['documentos', 'formulario']
      });

      if (!postulante) {
        this.logger.warn(`Postulante no encontrado con ID: ${id}`);
        throw new HttpException(
          'Postulante no encontrado',
          HttpStatus.NOT_FOUND
        );
      }

      this.logger.log(`Postulante encontrado: ${id}`);
      return {
        status: 200,
        message: 'Postulante encontrado exitosamente',
        data: postulante
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error al buscar postulante: ${error.message}`);
      throw new HttpException(
        'Error interno del servidor al buscar postulante',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: string, updatePostulanteDto: UpdatePostulanteDto) {
    try {
      this.logger.log(`Actualizando postulante con ID: ${id}`);
      
      const postulante = await this.postulanteRepository.findOne({
        where: { postulanteID: id }
      });

      if (!postulante) {
        this.logger.warn(`Postulante no encontrado para actualizar con ID: ${id}`);
        throw new HttpException(
          'Postulante no encontrado',
          HttpStatus.NOT_FOUND
        );
      }

      // Separar documentos del DTO de actualización si existen
      const { documentos, ...postulanteData } = updatePostulanteDto;

      // Si se actualiza RUT, verificar que no exista otro postulante con el mismo RUT y formulario_id
      if (postulanteData.rut && postulanteData.rut !== postulante.rut) {
        const formulario_id = postulanteData.formulario_id || postulante.formulario_id;
        const existePostulacion = await this.postulanteRepository.findOne({
          where: { 
            rut: postulanteData.rut,
            formulario_id: formulario_id
          }
        });

        if (existePostulacion) {
          this.logger.warn(`Ya existe una postulación para el RUT ${postulanteData.rut} en el formulario ${formulario_id}`);
          throw new HttpException(
            'Ya estás postulando a este cargo',
            HttpStatus.CONFLICT
          );
        }
      }

      // Nota: Permitimos que el mismo email se use en diferentes formularios

      await this.postulanteRepository.update(id, postulanteData);
      const postulanteActualizado = await this.postulanteRepository.findOne({
        where: { postulanteID: id },
        relations: ['documentos', 'formulario']
      });

      this.logger.log(`Postulante actualizado exitosamente: ${id}`);
      return {
        status: 200,
        message: 'Postulante actualizado exitosamente',
        data: postulanteActualizado
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error al actualizar postulante: ${error.message}`);
      throw new HttpException(
        'Error interno del servidor al actualizar postulante',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(id: string) {
    try {
      this.logger.log(`Eliminando postulante con ID: ${id}`);
      
      const postulante = await this.postulanteRepository.findOne({
        where: { postulanteID: id }
      });

      if (!postulante) {
        this.logger.warn(`Postulante no encontrado para eliminar con ID: ${id}`);
        throw new HttpException(
          'Postulante no encontrado',
          HttpStatus.NOT_FOUND
        );
      }

      await this.postulanteRepository.remove(postulante);
      
      this.logger.log(`Postulante eliminado exitosamente: ${id}`);
      return {
        status: 200,
        message: 'Postulante eliminado exitosamente'
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error al eliminar postulante: ${error.message}`);
      throw new HttpException(
        'Error interno del servidor al eliminar postulante',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findByRut(rut: string) {
    try {
      this.logger.log(`Buscando postulante por RUT: ${rut}`);
      const postulante = await this.postulanteRepository.findOne({
        where: { rut },
        relations: ['documentos', 'formulario']
      });

      if (!postulante) {
        this.logger.warn(`Postulante no encontrado con RUT: ${rut}`);
        throw new HttpException(
          'Postulante no encontrado',
          HttpStatus.NOT_FOUND
        );
      }

      this.logger.log(`Postulante encontrado por RUT: ${rut}`);
      return {
        status: 200,
        message: 'Postulante encontrado exitosamente',
        data: postulante
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error al buscar postulante por RUT: ${error.message}`);
      throw new HttpException(
        'Error interno del servidor al buscar postulante por RUT',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findByEmail(email: string) {
    try {
      this.logger.log(`Buscando postulante por email: ${email}`);
      const postulante = await this.postulanteRepository.findOne({
        where: { email },
        relations: ['documentos', 'formulario']
      });

      if (!postulante) {
        this.logger.warn(`Postulante no encontrado con email: ${email}`);
        throw new HttpException(
          'Postulante no encontrado',
          HttpStatus.NOT_FOUND
        );
      }

      this.logger.log(`Postulante encontrado por email: ${email}`);
      return {
        status: 200,
        message: 'Postulante encontrado exitosamente',
        data: postulante
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error al buscar postulante por email: ${error.message}`);
      throw new HttpException(
        'Error interno del servidor al buscar postulante por email',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
