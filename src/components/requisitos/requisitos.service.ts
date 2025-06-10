import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRequisitoDto } from './dto/create-requisito.dto';
import { UpdateRequisitoDto } from './dto/update-requisito.dto';
import { Requisito } from './entities/requisito.entity';

@Injectable()
export class RequisitosService {
  constructor(
    @InjectRepository(Requisito)
    private requisitoRepository: Repository<Requisito>,
  ) {}

  async create(createRequisitoDto: CreateRequisitoDto): Promise<Requisito> {
    const requisito = this.requisitoRepository.create(createRequisitoDto);
    return await this.requisitoRepository.save(requisito);
  }

  async findAll(): Promise<Requisito[]> {
    return await this.requisitoRepository.find({
      order: { fechaCreacion: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Requisito> {
    const requisito = await this.requisitoRepository.findOne({
      where: { id }
    });
    
    if (!requisito) {
      throw new NotFoundException(`Requisito con ID ${id} no encontrado`);
    }
    
    return requisito;
  }

  async update(id: number, updateRequisitoDto: UpdateRequisitoDto): Promise<Requisito> {
    const requisito = await this.findOne(id);
    await this.requisitoRepository.update(id, updateRequisitoDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const requisito = await this.findOne(id);
    await this.requisitoRepository.remove(requisito);
  }

  async buscarRequisitos(termino: string): Promise<Requisito[]> {
    const queryBuilder = this.requisitoRepository.createQueryBuilder('requisito');
    
    queryBuilder.where(
      'requisito.nombre LIKE :termino OR requisito.descripcion LIKE :termino',
      { termino: `%${termino}%` }
    );
    
    queryBuilder.orderBy('requisito.fechaCreacion', 'DESC');
    
    return await queryBuilder.getMany();
  }

  async filtrarRequisitos(filtros: {
    nombre?: string;
    tipo?: string;
    activo?: boolean;
    subeArchivo?: boolean;
  }): Promise<Requisito[]> {
    const queryBuilder = this.requisitoRepository.createQueryBuilder('requisito');

    if (filtros.nombre) {
      queryBuilder.andWhere('requisito.nombre LIKE :nombre', {
        nombre: `%${filtros.nombre}%`
      });
    }

    if (filtros.tipo) {
      queryBuilder.andWhere('requisito.tipo = :tipo', {
        tipo: filtros.tipo
      });
    }

    if (filtros.activo !== undefined) {
      queryBuilder.andWhere('requisito.activo = :activo', {
        activo: filtros.activo
      });
    }

    queryBuilder.orderBy('requisito.fechaCreacion', 'DESC');

    return await queryBuilder.getMany();
  }
} 