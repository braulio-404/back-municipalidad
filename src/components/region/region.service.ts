import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { Region } from './entities/region.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region)
    private regionRepository: Repository<Region>,
  ) {}

  async findAll() {
    try {
      const regions = await this.regionRepository.find({
        relations: ['comunas'],
        order: { regionId: 'ASC' },
      });
      
      return {
        status: 'success',
        message: 'Regiones obtenidas correctamente',
        data: regions,
        count: regions.length,
      };
    } catch (error) {
      throw new BadRequestException({
        status: 'error',
        message: 'Error al obtener las regiones',
        error: error.message,
      });
    }
  }

  async findOne(regionId: number) {
    try {
      const region = await this.regionRepository.findOne({ 
        where: { regionId },
        relations: ['comunas'],
      });
      
      if (!region) {
        throw new NotFoundException({
          status: 'error',
          message: `Región con ID ${regionId} no encontrada`,
        });
      }

      return {
        status: 'success',
        message: 'Región obtenida correctamente',
        data: region,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}