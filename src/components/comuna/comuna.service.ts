import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comuna } from './entities/comuna.entity';

@Injectable()
export class ComunaService {
  constructor(
    @InjectRepository(Comuna)
    private comunaRepository: Repository<Comuna>,
  ) {}

  async findAll() {
    try {
      const comunas = await this.comunaRepository.find({
        relations: ['region'],
        order: { comunaId: 'ASC' },
      });
      
      return {
        status: 'success',
        message: 'Comunas obtenidas correctamente',
        data: comunas,
        count: comunas.length,
      };
    } catch (error) {
      throw new BadRequestException({
        status: 'error',
        message: 'Error al obtener las comunas',
        error: error.message,
      });
    }
  }

  async findOne(comunaId: number) {
    try {
      const comuna = await this.comunaRepository.findOne({
        where: { comunaId },
        relations: ['region'],
      });
      
      if (!comuna) {
        throw new NotFoundException({
          status: 'error',
          message: `Comuna con ID ${comunaId} no encontrada`,
        });
      }

      return {
        status: 'success',
        message: 'Comuna obtenida correctamente',
        data: comuna,
      };
    } catch (error) {
      throw new Error(error);
    }
  }


  async findByRegionId(regionId: number) {
    try {
      const comunas = await this.comunaRepository.find({
        where: { regionId },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
