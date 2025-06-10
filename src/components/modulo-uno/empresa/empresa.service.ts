import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { Empresa } from './entities/empresa.entity';

@Injectable()
export class EmpresaService {
  private readonly logger = new Logger(EmpresaService.name);

  constructor(
    @InjectRepository(Empresa)
    private empresaRepository: Repository<Empresa>,
  ) {}

  async create(createEmpresaDto: CreateEmpresaDto) {
    try {
      this.logger.log('Creando nueva empresa');
      
      const empresa = this.empresaRepository.create(createEmpresaDto);
      const savedEmpresa = await this.empresaRepository.save(empresa);

      this.logger.log(`Empresa creada exitosamente con ID: ${savedEmpresa.empresaID}`);
      
      return {
        status: 200,
        message: 'Empresa creada exitosamente',
        data: savedEmpresa,
      };
    } catch (error) {
      this.logger.error(`Error al crear empresa: ${error.message}`, error.stack);
      throw new BadRequestException({
        status: 'error',
        message: 'Error al crear la empresa',
        error: error.message,
      });
    }
  }

  async findAll() {
    try {
      this.logger.log('Obteniendo todas las empresas');
      
      const empresas = await this.empresaRepository.find({
        relations: ['proyectos', 'documentos'],
        order: { razonSocial: 'ASC' },
      });

      this.logger.log(`Se encontraron ${empresas.length} empresas`);
      
      return {
        status: 200,
        message: 'Empresas obtenidas correctamente',
        data: empresas,
        count: empresas.length,
      };
    } catch (error) {
      this.logger.error(`Error al obtener empresas: ${error.message}`, error.stack);
      throw new BadRequestException({
        status: 'error',
        message: 'Error al obtener las empresas',
        error: error.message,
      });
    }
  }

  async findOne(id: string) {
    try {
      this.logger.log(`Buscando empresa con ID: ${id}`);
      
      const empresa = await this.empresaRepository.findOne({
        where: { empresaID: id },
        relations: ['proyectos', 'documentos'],
      });

      if (!empresa) {
        this.logger.warn(`Empresa con ID ${id} no encontrada`);
        throw new NotFoundException({
          status: 'error',
          message: `Empresa con ID ${id} no encontrada`,
        });
      }

      this.logger.log(`Empresa encontrada: ${empresa.razonSocial}`);
      
      return {
        status: 200,
        message: 'Empresa obtenida correctamente',
        data: empresa,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error al obtener empresa: ${error.message}`, error.stack);
      throw new BadRequestException({
        status: 'error',
        message: 'Error al obtener la empresa',
        error: error.message,
      });
    }
  }

  async update(id: string, updateEmpresaDto: UpdateEmpresaDto) {
    try {
      this.logger.log(`Actualizando empresa con ID: ${id}`);
      
      const empresa = await this.empresaRepository.findOne({
        where: { empresaID: id },
      });

      if (!empresa) {
        this.logger.warn(`Empresa con ID ${id} no encontrada para actualizar`);
        throw new NotFoundException({
          status: 'error',
          message: `Empresa con ID ${id} no encontrada`,
        });
      }

      await this.empresaRepository.update(id, updateEmpresaDto);
      const updatedEmpresa = await this.empresaRepository.findOne({
        where: { empresaID: id },
        relations: ['proyectos', 'documentos'],
      });

      this.logger.log(`Empresa actualizada exitosamente: ${updatedEmpresa.razonSocial}`);
      
      return {
        status: 200,
        message: 'Empresa actualizada exitosamente',
        data: updatedEmpresa,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error al actualizar empresa: ${error.message}`, error.stack);
      throw new BadRequestException({
        status: 'error',
        message: 'Error al actualizar la empresa',
        error: error.message,
      });
    }
  }

  async remove(id: string) {
    try {
      this.logger.log(`Eliminando empresa con ID: ${id}`);
      
      const empresa = await this.empresaRepository.findOne({
        where: { empresaID: id },
      });

      if (!empresa) {
        this.logger.warn(`Empresa con ID ${id} no encontrada para eliminar`);
        throw new NotFoundException({
          status: 'error',
          message: `Empresa con ID ${id} no encontrada`,
        });
      }

      await this.empresaRepository.remove(empresa);

      this.logger.log(`Empresa eliminada exitosamente: ${empresa.razonSocial}`);
      
      return {
        status: 200,
        message: 'Empresa eliminada exitosamente',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error al eliminar empresa: ${error.message}`, error.stack);
      throw new BadRequestException({
        status: 'error',
        message: 'Error al eliminar la empresa',
        error: error.message,
      });
    }
  }
}
