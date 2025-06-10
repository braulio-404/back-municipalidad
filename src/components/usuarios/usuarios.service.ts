import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      const usuario = this.usuarioRepository.create(createUsuarioDto);
      const savedUsuario = await this.usuarioRepository.save(usuario);
      
      return {
        status: 'success',
        message: 'Usuario creado correctamente',
        data: savedUsuario,
      };
    } catch (error) {
      throw new BadRequestException({
        status: 'error',
        message: 'Error al crear el usuario',
        error: error.message,
      });
    }
  }

  async findAll() {
    try {
      const usuarios = await this.usuarioRepository.find({
        order: { usuarioID: 'ASC' },
      });
      
      return {
        status: 'success',
        message: 'Usuarios obtenidos correctamente',
        data: usuarios,
        count: usuarios.length,
      };
    } catch (error) {
      throw new BadRequestException({
        status: 'error',
        message: 'Error al obtener los usuarios',
        error: error.message,
      });
    }
  }

  async findOne(usuarioID: string) {
    try {
      const usuario = await this.usuarioRepository.findOne({
        where: { usuarioID },
      });
      
      if (!usuario) {
        throw new NotFoundException({
          status: 'error',
          message: `Usuario con ID ${usuarioID} no encontrado`,
        });
      }

      return {
        status: 'success',
        message: 'Usuario obtenido correctamente',
        data: usuario,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException({
        status: 'error',
        message: 'Error al obtener el usuario',
        error: error.message,
      });
    }
  }

  async findByEmail(email: string) {
    try {
      const usuario = await this.usuarioRepository.findOne({
        where: { email },
      });

      if (!usuario) {
        throw new NotFoundException({
          status: 'error',
          message: `Usuario con email ${email} no encontrado`,
        });
      }

      return {
        status: 'success',
        message: 'Usuario obtenido correctamente',
        data: usuario,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException({
        status: 'error',
        message: 'Error al obtener el usuario por email',
        error: error.message,
      });
    }
  }

  async update(usuarioID: string, updateUsuarioDto: UpdateUsuarioDto) {
    try {
      const usuario = await this.findOne(usuarioID);
      
      await this.usuarioRepository.update(usuarioID, updateUsuarioDto);
      const updatedUsuario = await this.usuarioRepository.findOne({
        where: { usuarioID },
      });

      return {
        status: 'success',
        message: 'Usuario actualizado correctamente',
        data: updatedUsuario,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException({
        status: 'error',
        message: 'Error al actualizar el usuario',
        error: error.message,
      });
    }
  }

  async remove(usuarioID: string) {
    try {
      const usuario = await this.findOne(usuarioID);
      
      await this.usuarioRepository.delete(usuarioID);

      return {
        status: 'success',
        message: 'Usuario eliminado correctamente',
        data: { usuarioID },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException({
        status: 'error',
        message: 'Error al eliminar el usuario',
        error: error.message,
      });
    }
  }
}
