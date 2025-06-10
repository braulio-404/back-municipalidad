import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreatePostulacionDto } from './dto/create-postulacion.dto';
import { UpdatePostulacionDto } from './dto/update-postulacion.dto';
import { Postulacion } from './entities/postulacion.entity';

@Injectable()
export class PostulacionesService {
  constructor(
    @InjectRepository(Postulacion)
    private postulacionRepository: Repository<Postulacion>,
  ) {}

  async create(createPostulacionDto: CreatePostulacionDto): Promise<Postulacion> {
    const postulacion = this.postulacionRepository.create({
      ...createPostulacionDto,
      fechaVencimiento: new Date(createPostulacionDto.fechaVencimiento),
    });
    return await this.postulacionRepository.save(postulacion);
  }

  async findAll(): Promise<Postulacion[]> {
    return await this.postulacionRepository.find({
      order: { fechaCreacion: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Postulacion> {
    const postulacion = await this.postulacionRepository.findOne({
      where: { id }
    });
    
    if (!postulacion) {
      throw new NotFoundException(`Postulación con ID ${id} no encontrada`);
    }
    
    return postulacion;
  }

  async update(id: number, updatePostulacionDto: UpdatePostulacionDto): Promise<Postulacion> {
    const postulacion = await this.findOne(id);
    
    const updateData = {
      ...updatePostulacionDto,
      ...(updatePostulacionDto.fechaVencimiento && {
        fechaVencimiento: new Date(updatePostulacionDto.fechaVencimiento)
      })
    };

    await this.postulacionRepository.update(id, updateData);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const postulacion = await this.findOne(id);
    await this.postulacionRepository.remove(postulacion);
  }

  async filtrarPostulaciones(filtros: {
    titulo?: string;
    estado?: 'activa' | 'vencida';
  }): Promise<Postulacion[]> {
    const queryBuilder = this.postulacionRepository.createQueryBuilder('postulacion');

    if (filtros.titulo) {
      queryBuilder.andWhere('postulacion.titulo LIKE :titulo', {
        titulo: `%${filtros.titulo}%`
      });
    }

    if (filtros.estado) {
      queryBuilder.andWhere('postulacion.estado = :estado', {
        estado: filtros.estado
      });
    }

    queryBuilder.orderBy('postulacion.fechaCreacion', 'DESC');

    return await queryBuilder.getMany();
  }
} 