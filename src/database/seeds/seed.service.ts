import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from '../../components/region/entities/region.entity';
import { Comuna } from '../../components/comuna/entities/comuna.entity';
import { regionSeedData } from './region.seed';
import { comunaSeedData } from './comuna.seed';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Region)
    private regionRepository: Repository<Region>,
    @InjectRepository(Comuna)
    private comunaRepository: Repository<Comuna>,
  ) {}

  async seedRegions() {
    const existingRegions = await this.regionRepository.count();
    if (existingRegions === 0) {
      console.log('🌱 Sembrando regiones...');
      await this.regionRepository.save(regionSeedData);
      console.log('✅ Regiones sembradas exitosamente');
    } else {
      console.log('ℹ️ Las regiones ya existen, omitiendo seed');
    }
  }

  async seedComunas() {
    const existingComunas = await this.comunaRepository.count();
    if (existingComunas === 0) {
      console.log('🌱 Sembrando comunas...');
      await this.comunaRepository.save(comunaSeedData);
      console.log('✅ Comunas sembradas exitosamente');
    } else {
      console.log('ℹ️ Las comunas ya existen, omitiendo seed');
    }
  }

  async runAllSeeds() {
    console.log('🚀 Iniciando proceso de semillas...');
    await this.seedRegions();
    await this.seedComunas();
    console.log('🎉 Proceso de semillas completado');
  }
} 